import { DataPoint } from '@/lib/types';
import { generateDataPoint } from '@/lib/dataGenerator'; // 1. IMPORT

export const dynamic = 'force-dynamic';

export async function GET() {
  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      intervalId = setInterval(() => {
        // 2. USE the generator function
        const dataPoint = generateDataPoint(); 

        const message = `data: ${JSON.stringify(dataPoint)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      }, 100);
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}