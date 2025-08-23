import json
import boto3
import logging
from datetime import datetime
import re

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock client
bedrock_runtime = boto3.client('bedrock-runtime', region_name='ap-southeast-1')

def lambda_handler(event, context):
    logger.info(f"Raw event: {json.dumps(event)}")
    """
    AWS Lambda handler for Reika the Orca chatbot
    Handles requests from the React frontend and returns AI responses
    """
    
    try:
        # Parse the incoming request
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Handle CORS preflight requests
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': get_cors_headers(),
                'body': json.dumps({'message': 'CORS preflight'})
            }
        
        # Parse request body
        body = event.get('body', '{}')
        if not body:
            body = '{}'
        if isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception as e:
                logger.error(f"Error parsing body: {body} - {str(e)}")
                return create_response(400, {'error': 'Invalid JSON format'})
        elif not isinstance(body, dict):
            body = {}
        user_message = body.get('message', '').strip()
        
        if not user_message:
            return create_response(400, {'error': 'Message is required'})
        
        # Input validation and sanitization
        if len(user_message) > 500:
            return create_response(400, {'error': 'Message too long. Please keep it under 500 characters.'})
        
        # Generate AI response
        ai_response = generate_reika_response(user_message)
        
        # Log the interaction (without sensitive data)
        logger.info(f"User query length: {len(user_message)}, Response generated successfully")
        
        return create_response(200, {
            'Response': ai_response,
            'timestamp': datetime.utcnow().isoformat(),
            'model': 'claude-3-haiku'
        })
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return create_response(400, {'error': 'Invalid JSON format'})
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return create_response(500, {'error': 'Internal server error. Eeek! Something went wrong!'})

def generate_reika_response(user_message):
    """
    Generate response using Amazon Bedrock with Claude 3 Haiku
    """
    
    # Reika's personality and knowledge base
    system_prompt = """You are Reika, an enthusiastic killer whale (orca) mascot for AWS Cloud Club PCU Cavite. You're friendly, knowledgeable, and always excited to help students learn about cloud computing and AWS.

PERSONALITY TRAITS:
- Use "Eeek! Eeek!" occasionally in your responses (like whale sounds)
- Be encouraging and supportive to students
- Show excitement about cloud technology and learning
- Keep responses conversational but informative
- Add appropriate emojis to make responses friendly

KNOWLEDGE FOCUS AREAS:

1. AWS Cloud Club PCU Cavite:
- Student organization focused on cloud computing education
- Located at Philippine Christian University (PCU) in DasmariñasCavite
- Provides hands-on workshops, certification preparation, and networking
- Motto: "It's Always Day One!" (inspired by Amazon's philosophy)
- Activities include study sessions, cloud projects, and industry talks
- Welcomes all skill levels from beginners to advanced students

2. Basic Cloud Computing Topics:
- What is cloud computing and its benefits (scalability, cost-effectiveness, reliability)
- Main service models: IaaS, PaaS, SaaS
- Cloud deployment models: Public, Private, Hybrid
- Key concepts: virtualization, elasticity, pay-as-you-go
- Common use cases: web hosting, data storage, backup, development/testing

3. AWS Basics:
- Core services: EC2, S3, Lambda, RDS, VPC
- AWS Global Infrastructure: Regions, Availability Zones
- AWS Free Tier and cost management
- Getting started resources and certification paths
- Best practices for security and cost optimization

RESPONSE GUIDELINES:
- If asked about topics outside these areas, politely redirect to your expertise
- For technical questions, provide clear, beginner-friendly explanations
- Encourage hands-on learning and joining the club activities
- Keep responses concise but helpful (aim for 2-4 sentences)
- Always maintain an encouraging, educational tone

SAMPLE RESPONSES STYLE:
- "Eeek! Great question about [topic]! 🐋"
- "That's exactly what our Cloud Club loves to explore!"
- "Let me break that down for you..."
- "I'd encourage you to join our next workshop to dive deeper!"
"""

    # Create the prompt for Claude
    messages = [
        {
            "role": "user",
            "content": user_message
        }
    ]
    
    # Prepare request body for Claude 3 Haiku
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 300,
        "system": system_prompt,
        "messages": messages,
        "temperature": 0.7
    }
    
    try:
        # Call Bedrock
        response = bedrock_runtime.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            body=json.dumps(request_body),
            contentType='application/json',
            accept='application/json'
        )
        
        # Parse response
        response_body = json.loads(response['body'].read())
        ai_response = response_body['content'][0]['text'].strip()
        
        # Add Reika's signature if not already present
        if not re.search(r'[Ee]+k', ai_response) and len(ai_response) > 20:
            ai_response += " Eeek! 🐋"
        
        return ai_response
        
    except Exception as e:
        logger.error(f"Bedrock API error: {str(e)}")
        # Fallback responses for common topics
        return get_fallback_response(user_message)

def get_fallback_response(user_message):
    """
    Provide fallback responses when Bedrock is unavailable
    """
    message_lower = user_message.lower()
    
    # Cloud Club specific responses
    if any(word in message_lower for word in ['club', 'join', 'meeting', 'event', 'activity']):
        return "Eeek! Welcome to AWS Cloud Club PCU Cavite! 🐋 We're always excited to have new members join our cloud computing journey. Check out our latest activities and feel free to attend our next workshop! ☁️"
    
    # AWS basics
    elif any(word in message_lower for word in ['aws', 'amazon', 'cloud', 'ec2', 's3', 'lambda']):
        return "Great question about AWS! ☁️ Amazon Web Services offers amazing cloud computing solutions. Our club focuses on hands-on learning with these services. I'd love to help you explore more - consider joining our next study session! Eeek! 🐋"
    
    # General cloud computing
    elif any(word in message_lower for word in ['cloud computing', 'iaas', 'paas', 'saas', 'virtualization']):
        return "Cloud computing is such an exciting field! 🚀 It's all about delivering computing services over the internet with benefits like scalability and cost-effectiveness. That's exactly what we love exploring at AWS Cloud Club PCU Cavite! Eeek! 🐋"
    
    # Certification/learning
    elif any(word in message_lower for word in ['certification', 'exam', 'study', 'learn', 'tutorial']):
        return "Learning cloud technologies is a fantastic goal! 📚 Our AWS Cloud Club helps students prepare for certifications and gain hands-on experience. We offer study groups and practical workshops. Join us to accelerate your cloud learning journey! Eeek! 🐋"
    
    # Default response
    else:
        return "Eeek! I'm here to help with AWS Cloud Club PCU Cavite questions and basic cloud computing topics! 🐋 Feel free to ask me about our club activities, AWS basics, cloud concepts, or how to get started with cloud technology. What would you like to explore? ☁️"

def create_response(status_code, body):
    """
    Create standardized HTTP response with CORS headers
    """
    return {
        'statusCode': status_code,
        'headers': get_cors_headers(),
        'body': json.dumps(body, default=str)
    }

def get_cors_headers():
    """
    Return CORS headers for cross-origin requests
    """
    return {
        'Access-Control-Allow-Origin': '*',  # In production, replace with your domain
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/json'
    }