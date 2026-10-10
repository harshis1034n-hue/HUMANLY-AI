import {
  HealthStatus,
  RoboticAnalysisResult,
  HumanizeResponse,
  VerificationReport,
  TextType,
  ToneMode,
  HumanizationLevel
} from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    let message = 'An unexpected error occurred.';
    let code = 'SERVER_ERROR';

    if (data && typeof data === 'object') {
      message = data.message || data.detail?.message || data.detail || JSON.stringify(data);
      code = data.error || data.detail?.error || `HTTP_${res.status}`;
    } else if (typeof data === 'string' && data) {
      message = data;
    }

    throw new ApiError(message, code, res.status);
  }

  return data as T;
}

export const api = {
  async getHealth(): Promise<HealthStatus> {
    try {
      const res = await fetch(`${API_BASE}/health`, {
        headers: { 'Accept': 'application/json' }
      });
      return await handleResponse<HealthStatus>(res);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError('Unable to connect to Humanly AI backend server. Please verify the backend is running.', 'NETWORK_ERROR', 0);
    }
  },

  async analyzeText(text: string): Promise<RoboticAnalysisResult> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    return await handleResponse<RoboticAnalysisResult>(res);
  },

  async humanizeText(
    text: string,
    textType: TextType,
    tone: ToneMode,
    level: HumanizationLevel,
    optionalContext?: string,
    apiKey?: string
  ): Promise<HumanizeResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (apiKey && apiKey.trim()) {
      headers['x-gemini-api-key'] = apiKey.trim();
    }

    const res = await fetch(`${API_BASE}/humanize`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        textType,
        context: textType, // legacy support
        tone,
        level,
        length: level, // legacy support
        optionalContext: optionalContext?.trim() || undefined,
        apiKey: apiKey?.trim() || undefined
      })
    });

    return await handleResponse<HumanizeResponse>(res);
  },

  async verifyText(
    sourceText: string,
    rewrittenText: string,
    apiKey?: string
  ): Promise<VerificationReport> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (apiKey && apiKey.trim()) {
      headers['x-gemini-api-key'] = apiKey.trim();
    }

    const res = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sourceText,
        rewrittenText,
        apiKey: apiKey?.trim() || undefined
      })
    });

    return await handleResponse<VerificationReport>(res);
  }
};
