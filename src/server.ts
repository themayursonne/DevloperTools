import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { getContext } from '@netlify/angular-runtime/context'

// Create an instance of the Angular SSR engine
const angularAppEngine = new AngularAppEngine()

// Netlify SSR function - This MUST be named `netlifyAppEngineHandler`
export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext()

  // Allow Angular to handle the request
  const result = await angularAppEngine.handle(request, context)
  return result || new Response('Not found', { status: 404 })
}

// Request handler used by Angular CLI
export const reqHandler = createRequestHandler(netlifyAppEngineHandler)
