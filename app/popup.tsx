import * as React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { storageSet } from './helper';

export default function Popup() {
  const [url, setUrl] = useState<string>();

  const saveUrl = () => {
    storageSet({
      'test-url': url,
    });
  };

  return (
    <div>
      <Input
        id="standard-basic"
        value={url}
        onChange={(value) => setUrl((value.target as any).value)}
      />
      <Button variant="contained" color="primary" onClick={saveUrl}>
        button
      </Button>
    </div>
  );
}
