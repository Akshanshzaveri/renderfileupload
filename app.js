// app.js

document.addEventListener('DOMContentLoaded', () => {
  // Disable right-click and developer tools
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'I') e.preventDefault();
    if (e.ctrlKey && e.key === 'U') e.preventDefault();
    if (e.key === 'F12') e.preventDefault();
  });

  const FOLDER_ID = '1Vtrjw1SyLzDO-q0W3GE9T6l5k-suR14u';
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
  let file = null;
  let accessToken = null;

  // Service account credentials
  const keys = {
    type: "service_account",
    project_id: "file-upload-464110",
    private_key_id: "192172f50f5016c02d415487ebf07b547342440e",
    private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD5G00Dm2oSaOxp
tgPZXD1geruWagJ6T7W9CEIRwHmTOpS16zkbcfHSLJ7cp3pzFSLgNQc42LMuv4mJ
XZ4zOOoZRsip06/BfbtcXsIZomgQfyDyNHUnrJvjeoxga+DK/pQJnQGFJDoHpbQo
Pv1dlgGQOSImy6rFiwqI0wD+5YP1id6+JtjeHUNrkc99JbLb6+GIbe4QfAipKsSJ
2UiCi0GVzgk+Z8HTNzNT+U8fWQPKzGnhYxu/JXf9w/FDUCIOcRYmxJ6c1roISgD0
5VyA79qlPNR3dK9NMUImuVHykIMsHsa22Oa6QIlNq/0OZTFf8U18QxOEhzUbgRaV
djVROsjfAgMBAAECggEAN8wBLp8nnbMJzU3bQ9sQ1mT3UqQxJONo0kwgvGgv8yXq
fGsRMhAOOeULumH7H/7qfmzyTq3fSMfXT0D8d/22Fe5QcRW85uq6RmDlOieyBovr
PcU5Pqc/ja779XcEdYObdiHIXuGz69WWanNdfhJlDEB34Ve6SyAvPmGA9hdDvQHx
FP8ZILrHiGXQtd2zdp0JhKueTPrSTV02c6XRYud+qXuyRav69l0/X32+0wT1SUpc
tSaanb1EqqYIAIv7p7EaGJqqveNWLAMbLGqlLpDd35A8iLsHW7WxltD/JXFM9vNc
3eRxgX6HWbPx/C2Avt+0fu2wYL60MoJh7VV4j5hzsQKBgQD8tz4Pefa0gImTs0oj
huW12LVty4YsS6TEI+cedFbpDS05qvEwlNdm9vR0kw0A7+H/mT909muePlOAmP6Y
dkBllQsUus+dSxBp8VtQ17r9WLL1vuAJThQNao8WW2FC6RCNItb5a/WTJuyBwIgP
MjG1yqPcOiXLBj98plW2nuveMQKBgQD8WA0aEX+tWvOQ7IdL1iu018ANgilT87XX
OfxLwMavuwNCh4WE6rJlNLBEhZ8YZaSCg3HhJbtRLqVmjJW0QbRMiuj+W+RjvLSl
oKcmZoJUsIZYdxqQKsf5mSU4OdDIthRSuJ2rmH8SpKMUGKggzZtClD4DRTMa+YbC
BfKxRPAEDwKBgQDuI8rykI6/J0T9jvz1H4BFbRIChcBI63s3bVG0bBMeB9GvPvuL
OScGGv7e/1dIo8RGtOWMVU2yT68mRoXbq8shLmLDxQoxgfPUsaDIPJIzfKsfUiAS
BKZ2wgxWGAQ+Jhv3s3X6khZW9V33IzPThgw779mbhJvqhle7IY8xyO4hcQKBgG6Z
WQS37rHYTzCRuqrub7GPbkl9Zwe4pVZzv7SkBXE4EjGynD6pbw8UjL07o4NZ6USa
v+riUrs+KphLvcGHmrKBn6T8OZnNN4/wXdJi03Sy+e8EJMxTM9qd2MZP8MZHp5ip
+dEfwXI2XpOMSwQ1mXsQ5i0gw0lrXDjlyn0PrfLZAoGADiEWl0NHFWrTb/LCznzT
37GcgdgDm1y2Yw5bfVAKFYNLZIZdWOGL3UBE9qXgIydItr3kS7Qch+dP0w3rs8jS
NFsdllG4zyYJsNHBAeAoRWAsIbluO932uWHBHCXUtzmbsdJvlrGI7nvfVrEYSi8/
lUp4QjiU212lRjhV3SMw4QI=
-----END PRIVATE KEY-----`,
    client_email: "test1-382@file-upload-464110.iam.gserviceaccount.com",
    client_id: "106378482562789733286",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/test1-382%40file-upload-464110.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };

  // Authentication and upload state elements
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const buttonText = document.getElementById('buttonText');
  const progressBar = document.getElementById('progressBar');
  const downloadContainer = document.getElementById('downloadContainer');
  const downloadBtn = document.getElementById('downloadBtn');
  const messageDiv = document.getElementById('message');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  
  function handleFile(file) {
    if (file.size > MAX_FILE_SIZE) {
      alert('❌ File size exceeds 2 MB limit. Please select a smaller file.');
      fileInput.value = ''; // reset input
      selectFileBtn.disabled = true;
      downloadContainer.style.display = 'none';
      return;
    }

  // Generate JWT for service account authentication
  function generateJwt() {
    // KJUR.jws.JWS.sign is provided by jsrsasign library, ensure you include it.
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: keys.client_email,
      scope: 'https://www.googleapis.com/auth/drive.file',
      aud: keys.token_uri,
      exp: now + 3600,
      iat: now,
    };

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const key = keys.private_key;

    const jwt = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, key);
    return jwt;
  }

  // Exchange JWT for access token
  async function getAccessToken(jwt) {
    const response = await fetch(keys.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const data = await response.json();
    return data.access_token;
  }

  // Make uploaded file public and get direct download URL
  async function makeFilePublic(fileId) {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        }),
      });
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    } catch (error) {
      console.error('Error making file public:', error);
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  // Initialize authentication
  async function initAuth() {
    try {
      const jwt = generateJwt();
      accessToken = await getAccessToken(jwt);
      setMessage('✅ Authentication successful.', 'success');
      updateButtonState();
    } catch (error) {
      setMessage(`❌ Authentication failed: ${error.message}`, 'error');
      uploadButton.disabled = true;
    }
  }
  

  // Format bytes into readable file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Update progress bar width
  function updateProgressBar(value) {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${value}%`;
    }
  }
  

  // Update upload button state depending on auth and selected file validity
  function updateButtonState() {
    if (!accessToken) {
      uploadButton.disabled = true;
      buttonText.textContent = 'Authenticating...';
      return;
    }
    if (!file) {
      uploadButton.disabled = true;
      buttonText.textContent = 'Select a file';
      clearMessage();
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      uploadButton.disabled = true;
      buttonText.textContent = 'File exceeds 2 MB limit';
      setMessage(`⚠️ File size (${formatFileSize(file.size)}) exceeds 2 MB limit. Please select a smaller file.`, 'error');
      return;
    }
    uploadButton.disabled = false;
    buttonText.textContent = 'Upload File';
    setMessage('✔️ Ready to upload New or You can Download.', 'success');
  }

  // Show message with type: 'success' or 'error'
  function setMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
  }

  // Clear message area
  function clearMessage() {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }

  // Handle file selection event and validate size
  function handleFileSelect(selectedFile) {
    file = selectedFile;
    if (!file) {
      fileInfo.classList.remove('show');
      setMessage('⚠️ No file selected.', 'error');
      updateButtonState();
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage(`⚠️ File size (${formatFileSize(file.size)}) exceeds 2 MB limit. Please select a smaller file.`, 'error');
      fileInfo.classList.remove('show');
      file = null;
    } else {
      fileName.textContent = `📄 ${file.name}`;
      fileSize.textContent = `📏 ${formatFileSize(file.size)}`;
      fileInfo.classList.add('show');
      setMessage('✔️ Ready to upload.', 'success');
    }
    updateButtonState();
  }

  // Show download link after successful upload
  function showDownloadLink(url, fileName) {
    downloadBtn.href = url;
    downloadBtn.download = fileName;
    downloadContainer.classList.add('show');

    downloadBtn.addEventListener('click', () => {
      setTimeout(() => {
        downloadContainer.classList.remove('show');
        setMessage('✔️ Download completed. Ready for new upload.', 'success');
        fileInput.value = '';
        fileInfo.classList.remove('show');
        file = null;
        updateButtonState();
      }, 100);
    }, { once: true });
  }

  // Event listeners for drag & drop
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  // File input change event
  fileInput.addEventListener('change', e => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  // Upload button click event with validation and progress
  uploadButton.addEventListener('click', async () => {
    if (!file || !accessToken || file.size > MAX_FILE_SIZE) {
      setMessage('⚠️ Please select a file under 2 MB and ensure authentication.', 'error');
      return;
    }

    uploadButton.disabled = true;
    buttonText.style.opacity = '0';
    progressBar.classList.add('show');
    updateProgressBar(0);
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 90) progress = 90;
      updateProgressBar(progress);
    }, 200);

    setMessage('⏳ Uploading...', 'success');

    try {
      const metadata = {
        name: file.name,
        parents: [FOLDER_ID],
        mimeType: file.type || 'application/octet-stream',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      clearInterval(progressInterval);
      updateProgressBar(100);

      if (response.ok) {
        const result = await response.json();
        const downloadUrl = await makeFilePublic(result.id);
        setMessage('✅ Upload successful! Ready to Download.', 'success');
        showDownloadLink(downloadUrl, file.name);
      } else {
        const error = await response.json();
        setMessage(`❌ Upload failed: ${error.error.message}`, 'error');
        downloadContainer.classList.remove('show');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setMessage(`❌ Upload error: ${error.message}`, 'error');
      downloadContainer.classList.remove('show');
    } finally {
      setTimeout(() => {
        buttonText.style.opacity = '1';
        progressBar.classList.remove('show');
        updateProgressBar(0);
        updateButtonState();
      }, 500);
    }
  });

  // Start authentication on load
  initAuth();
});
