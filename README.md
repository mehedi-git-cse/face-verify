# Face Verify

A professional, modern face verification web application built with React, Vite, and Tailwind CSS. This application connects to a FastAPI backend to perform AI-powered face verification with 11+ quality checks.

![Face Verify](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## Features

- **Face Detection** - Detects faces and ensures single face in image
- **Eyes Detection** - Verifies eyes are visible and open
- **Image Quality** - Checks for blur and image clarity
- **Head Pose** - Ensures frontal face position
- **Lighting Analysis** - Validates proper lighting conditions
- **Background Check** - Analyzes background for distractions
- **Face Geometry** - Verifies proper face proportions
- **Text Detection** - Detects unwanted text in images
- **Hands Detection** - Checks for hands covering face
- **Object Detection** - Identifies foreign objects
- **Human Verification** - Confirms human presence

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend**: FastAPI (separate service)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- FastAPI backend running on `http://127.0.0.1:7000`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/face-verify.git
cd face-verify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Project Structure

```
face-verify/
├── src/
│   ├── components/
│   │   ├── ImageUploader.jsx    # Drag & drop image upload
│   │   ├── WebcamCapture.jsx    # Camera capture component
│   │   └── ResultCard.jsx       # Verification results display
│   ├── services/
│   │   └── api.js               # API communication layer
│   ├── App.jsx                  # Main application
│   ├── index.css                # Global styles & animations
│   └── main.jsx                 # Entry point
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## API Configuration

The application connects to a FastAPI backend. Update the API URL in `src/services/api.js`:

```javascript
const API_BASE = 'http://127.0.0.1:7000/api/v1';
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/get-token` | POST | Obtain authentication token |
| `/verify-face` | POST | Submit image for verification |

## Usage

1. **Authentication**: The app automatically authenticates on load
2. **Upload Image**: Drag & drop or click to upload a face image
3. **Use Webcam**: Capture a photo using your device camera
4. **Verify**: Click "Verify Face" to analyze the image
5. **View Results**: See summary or click for detailed analysis

## Screenshots

### Main Interface
- Professional dark theme with glassmorphism effects
- Upload and webcam tabs
- AI-powered verification button

### Results View
- Summary card with pass/fail status and score
- Quick stats for key metrics
- Expandable detailed analysis with 11 check categories

## Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_API_URL=http://127.0.0.1:7000/api/v1
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Atik Face Verification Systems**

---

Built with React + Vite + Tailwind CSS
