# Chat with Reika – AWS Cloud Club PCU Cavite Assistant

A modern, responsive chatbot interface for the AWS Cloud Club PCU Cavite. Reika is designed to answer questions about club activities, events, and resources.

## 🚀 Features

- **Modern Chat Interface**: Clean, responsive design with smooth animations
- **Brand Colors**: Uses the official AWS Cloud Club PCU Cavite color palette
- **Mobile-Friendly**: Optimized for all device sizes
- **AWS Integration Ready**: Configured for Lambda endpoint integration
- **Auto-Deploy**: GitHub Actions workflow for S3/CloudFront deployment

## 🛠️ Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Shadcn UI Components
- Vite for build tooling
- AWS S3 + CloudFront for hosting

## 📦 Installation & Development

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd reika-chatbot

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Endpoint Setup

1. Open `src/components/ChatBot.tsx`
2. Replace the placeholder URL in the `handleSendMessage` function:

```typescript
// Replace this line:
// const response = await fetch('YOUR_LAMBDA_ENDPOINT_HERE', {

// With your actual Lambda endpoint:
const response = await fetch('https://your-api-gateway-url.amazonaws.com/stage/chat', {
```

### AWS Deployment Setup

1. Create the following GitHub Secrets in your repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `S3_BUCKET_NAME`: Your S3 bucket name
   - `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

2. Push to the `main` branch to trigger automatic deployment

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   └── ChatBot.tsx      # Main chatbot component
├── pages/
│   └── Index.tsx        # Main page
├── lib/
│   └── utils.ts         # Utility functions
├── hooks/               # React hooks
├── index.css           # Global styles & design system
└── main.tsx            # App entry point

.github/
└── workflows/
    └── deploy.yml      # CI/CD pipeline
```

## 🤖 Chatbot Behavior

Reika is configured to:
- Only answer questions about AWS Cloud Club PCU Cavite
- Provide a friendly fallback message for off-topic questions
- Maintain conversation context through the chat session
- Display typing indicators and timestamps

## 🚀 Deployment

The app is configured for automatic deployment to AWS:

1. **S3 Hosting**: Static files served from S3 bucket
2. **CloudFront CDN**: Global content delivery with caching
3. **GitHub Actions**: Automatic build and deployment on push to main

### Manual Deployment

```bash
# Build the project
npm run build

# Upload to S3 (replace with your bucket name)
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache (replace with your distribution ID)
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for AWS Cloud Club PCU Cavite.

---

**AWS Cloud Club PCU Cavite** - Empowering students with cloud computing knowledge! ☁️
