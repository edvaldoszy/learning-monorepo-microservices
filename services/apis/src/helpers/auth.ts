function extractAuthWithScheme(scheme: string, authorization: string) {
  const [extractedScheme, extractedValue] = authorization.split(' ') || [];
  if (extractedScheme === scheme) {
    return extractedValue;
  }

  return null;
}

export function forwardAuthorizationHeader(headers: Record<string, string>) {
  const token = extractAuthWithScheme('JWT', headers.authorization);
  return {
    Authorization: `JWT ${token}`,
  };
}
