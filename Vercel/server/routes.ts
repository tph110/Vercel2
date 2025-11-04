import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { analyzeImage } from "./huggingface";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for image analysis
  app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      // Get the image buffer from multer
      const imageBuffer = req.file.buffer;

      // Call Hugging Face API
      const result = await analyzeImage(imageBuffer);

      res.json(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to analyze image' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
