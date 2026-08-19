export function apiUrl(path) {
  if (typeof window === 'undefined') {
    return path;
  }
  // When running the React development server, NODE_ENV is 'development'.
  // In this mode, we assume the API server is on port 4000.
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? `http://127.0.0.1:4000${path}` : path;
}

export async function apiRequest(path, options = {}) {
  if (typeof fetch !== 'function') {
    throw new Error('The API is not available in this environment.');
  }

  const response = await fetch(apiUrl(path), {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMessage);
  }

  return data;
}

function getResourceItems(resource, data) {
  if (resource === 'gallery') {
    return data.galleryItems || [];
  }
  return data[resource] || [];
}

export async function saveAdminItem(resource, item, editingId, setState) {
  const data = await apiRequest(`/api/${resource}${editingId ? `/${editingId}` : ''}`, {
    method: editingId ? 'PUT' : 'POST',
    body: item,
  });
  setState(getResourceItems(resource, data));
}

export async function deleteAdminItem(resource, id, setState) {
  const data = await apiRequest(`/api/${resource}/${id}`, {
    method: 'DELETE',
  });
  setState(getResourceItems(resource, data));
}

export function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function uniqueOptions(options) {
  return Array.from(new Set(options.filter(Boolean)));
}

export function splitLines(value) {
  return String(value || '')
    .split(/\r?\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function featuresToText(value) {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  return String(value || '');
}

export function normalizePricingPlans(plans) {
  return plans.map((plan) => ({
    ...plan,
    accent: plan.accent || 'cyan',
    price: {
      monthly: Number(plan.monthly ?? plan.price?.monthly ?? 0),
      yearly: Number(plan.yearly ?? plan.price?.yearly ?? plan.monthly ?? 0),
    },
    features: Array.isArray(plan.features) ? plan.features : splitLines(plan.features),
  }));
}

export function handleMediaUpload(event, { onLoaded, onError, setUploadingField, fieldName = 'media' }) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  setUploadingField(fieldName);
  reader.onload = async () => {
    try {
      const upload = await apiRequest('/api/uploads', {
        method: 'POST',
        body: {
          dataUrl: reader.result,
          fileName: file.name,
          mimeType: file.type,
        },
      });
      onLoaded({ url: upload.secureUrl, type: file.type });
    } catch (error) {
      onError(error.message || 'Upload failed.');
    } finally {
      setUploadingField('');
      event.target.value = '';
    }
  };
  reader.onerror = () => {
    onError('Could not read the selected file.');
    setUploadingField('');
  };
  reader.readAsDataURL(file);
}

export function downloadCsv(fileName, rows) {
  const safeRows = rows.length ? rows : [{}];
  const headers = Array.from(
    safeRows.reduce((keys, row) => {
      Object.keys(row || {}).forEach((key) => keys.add(key));
      return keys;
    }, new Set())
  );
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => `"${String(row?.[header] ?? '').replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
