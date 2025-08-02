// Rate limiter utility to prevent API overload
class RateLimiter {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.lastRequestTime = 0;
    this.minInterval = 1000; // Minimum 1 second between requests
  }

  async executeWithRateLimit(apiCall) {
    return new Promise((resolve, reject) => {
      this.queue.push({ apiCall, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const { apiCall, resolve, reject } = this.queue.shift();
      
      try {
        // Ensure minimum interval between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.minInterval) {
          await new Promise(res => setTimeout(res, this.minInterval - timeSinceLastRequest));
        }
        
        const result = await this.retryWithBackoff(apiCall);
        this.lastRequestTime = Date.now();
        resolve(result);
        
        // Small delay between queue items
        if (this.queue.length > 0) {
          await new Promise(res => setTimeout(res, 500));
        }
        
      } catch (error) {
        reject(error);
      }
    }
    
    this.isProcessing = false;
  }

  async retryWithBackoff(apiCall, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (error.response?.status === 429 && attempt < maxRetries - 1) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt + 1) * 1000;
          console.log(`Rate limited, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }
}

export const rateLimiter = new RateLimiter();