import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
}

const FileBrowser: React.FC = () => {
  const [contents, setContents] = useState<FileItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchFolderContents = async (path: string): Promise<void> => {
    if (!path) {
      console.error('Path not provided');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3101${path}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.contents || data.contents.length === 0) {
        console.warn('Folder is empty or data not received');
      }

      setContents(data.contents);
    } catch (error: any) {
      console.error('Error during request:', error.message);
    }
  };

  useEffect(() => {
    fetchFolderContents(location.pathname);
  }, [location.pathname]);

  const goUpOneLevel = (): void => {
    const newPath = location.pathname.split('/').slice(0, -1).join('/') || '/';
    navigate(newPath);
  };

  return (
    <div>
      <h2>Contents of {location.pathname}</h2>
      <ul>
        {location.pathname !== '/' && (
          <li className='list-item' onClick={goUpOneLevel}>
            📁 ...
          </li>
        )}
        {contents.length > 0 ? (
          contents.map((item) => (
            <li
              className={item.type === 'folder' ? 'list-item' : ''}
              key={item.name}
              onClick={() => {
                if (item.type === 'folder') {
                  const newPath = location.pathname.endsWith('/')
                    ? `${location.pathname}${item.name}`
                    : `${location.pathname}/${item.name}`;
                  navigate(newPath);
                }
              }}
            >
              {item.type === 'folder' ? '📁' : '📄'} {item.name}
            </li>
          ))
        ) : (
          <p>No data or loading...</p>
        )}
      </ul>
    </div>
  );
};

export default FileBrowser;
