import React from 'react';
import Tesseract from 'tesseract.js';
import './style.css';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState('');
  const [text, setText] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setCopied(false);

    Tesseract.recognize(image, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      })
      .then((result) => {
        setText(result.data.text);
        setIsLoading(false);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleBack = () => {
    setText('');
    setImage('');
    setProgress(0);
    setCopied(false);
    setIsLoading(false);
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div className="container-glass w-100" style={{ maxWidth: '700px' }}>
        {!isLoading && <h1 className="text-center mb-4">Image To Text</h1>}

        {isLoading && (
          <>
            <progress className="form-control" value={progress} max="100">
              {progress}%
            </progress>
            <p className="text-center mt-2">Converting: {progress}%</p>
          </>
        )}

        {!isLoading && !text && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(URL.createObjectURL(e.target.files[0]))
              }
              className="form-control my-3"
            />
            <button
              onClick={handleSubmit}
              className="btn btn-primary w-100 mb-3"
            >
              Convert
            </button>
          </>
        )}

        {!isLoading && text && (
          <>
            <textarea
              className="form-control mb-3"
              rows="10"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <div className="d-flex gap-2">
              <button onClick={handleCopy} className="btn btn-success w-100">
                {copied ? 'Copied ✅' : 'Copy Text'}
              </button>
              <button
                onClick={handleBack}
                className="btn btn-outline-light w-100"
              >
                ⬅ Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
