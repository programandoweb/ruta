<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ImagesRoute
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof Response) {
            $content = $response->getContent();
            
            if ($this->isJsonResponse($response)) {
                $data = json_decode($content, true);
                $data = $this->processArray($data);
                $response->setContent(json_encode($data));
            }
        }

        return $response;
    }

    private function isJsonResponse(Response $response): bool
    {
        return strpos($response->headers->get('Content-Type'), 'application/json') !== false;
    }

    private function processArray(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->processArray($value);
            } elseif (is_string($value) && strpos($value, 'images/') === 0 && !$this->isUrl($value)) {
                $data[$key] = $this->addBackendUrl($value);
            }
        }
        return $data;
    }

    private function isUrl(string $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }

    private function addBackendUrl(string $value): string
    {
        $backendUrl = config('app.url');
        return rtrim($backendUrl, '/') . '/' . ltrim($value, '/');
    }
}