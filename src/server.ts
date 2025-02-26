import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { getContext } from '@netlify/angular-runtime/context'

// 1. Create a single instance of the Angular SSR engine
const angularAppEngine = new AngularAppEngine()

// 2. Netlify SSR function
export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  // Retrieve Netlify context
  const context = getContext()

  // Pass request + context to Angular SSR
  const result = await angularAppEngine.handle(request, context)
  return result ?? new Response('Not found', { status: 404 })
}

// 3. Request handler used by the Angular CLI (dev-server and during build)
export const reqHandler = createRequestHandler(netlifyAppEngineHandler)
