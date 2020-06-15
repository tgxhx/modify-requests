import * as React from 'react';
import { useEffect, useReducer, useRef, useState } from 'react';
import JSONEditor from 'jsoneditor';
import { getConfig, setConfig } from '../model';
import { Button, TextField } from '@material-ui/core';
import { Color } from '@material-ui/lab';
import { StyledPanelDetail } from './modify-response-style';

interface Props {
  modifiedUrl?: ModifiedUrlModel;
  index?: number;
  handleSetShowAlert: (type: Color, message: string) => void;
  isNew: boolean;
  getStorageConfig: () => void;
}

interface States {
  show: boolean;
  name: string;
  url: string;
  jsonText: string;
  modifiedJson: string;
  enable: boolean;
}

type Action =
  | { type: 'name'; name: string }
  | { type: 'setShow'; show: boolean }
  | { type: 'setUrl'; url: string }
  | { type: 'setJsonText'; jsonText: string }
  | { type: 'setModifiedJson'; modifiedJson: string }
  | { type: 'setEnable'; enable: boolean };

function reducer(state: States, action: Action): States {
  switch (action.type) {
    case 'setShow':
      return { ...state, show: action.show };
    case 'name':
      return { ...state, name: action.name };
    case 'setUrl':
      return { ...state, url: action.url };
    case 'setJsonText':
      return { ...state, jsonText: action.jsonText };
    case 'setModifiedJson':
      return { ...state, modifiedJson: action.modifiedJson };
    case 'setEnable':
      return { ...state, enable: action.enable };
    default:
      return state;
  }
}

export default function ModifyResponseItem(props: Props) {
  const { modifiedUrl } = props;

  const jsonEditor = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<JSONEditor | undefined>();
  const [{ show, name, url, jsonText, modifiedJson, enable }, dispatch] = useReducer(reducer, {
    name: modifiedUrl?.name || '',
    show: false,
    url: modifiedUrl?.url || '',
    jsonText: modifiedUrl?.body || '',
    modifiedJson: modifiedUrl?.body || '',
    enable: typeof modifiedUrl?.enable === 'undefined' ? true : modifiedUrl?.enable,
  });

  const handleChangeJSONEditor = (editor: JSONEditor) => {
    if (editor) {
      const modifiedJson = editor.getText();
      dispatch({ type: 'setJsonText', jsonText: modifiedJson });
      dispatch({ type: 'setModifiedJson', modifiedJson });
    }
  };

  const initEditor = () => {
    if (jsonEditor.current) {
      const editor = new JSONEditor(jsonEditor.current, {
        mode: 'text',
        onChange: () => {
          handleChangeJSONEditor(editor);
        },
      });
      setEditor(editor);
    }
  };

  useEffect(() => {
    initEditor();
  }, []);

  const handleFormat = () => {
    if (!jsonText) return;
    dispatch({ type: 'setShow', show: true });
    let json: any;
    try {
      json = JSON.parse(jsonText);
    } catch (e) {
      json = jsonText;
    }
    if (typeof json === 'string') {
      editor?.setMode('text');
      editor?.updateText(json);
      dispatch({ type: 'setModifiedJson', modifiedJson: json });
    } else {
      editor?.setMode('tree');
      editor?.update(json);
      dispatch({ type: 'setModifiedJson', modifiedJson: JSON.stringify(json) });
    }
    editor?.expandAll?.();
  };

  const handleSaveConfig = async () => {
    if (!name || !url || !modifiedJson) return;
    const config = (await getConfig()) || {};
    const item = {
      name,
      url,
      body: modifiedJson,
      enable,
    };

    if (!props.isNew && props.index !== void 0) {
      const foundIndex = config.modifiedUrls?.findIndex((item, index) => {
        if (index === props.index) return false;
        return item.url === url;
      });
      if (foundIndex === -1) {
        // @ts-ignore
        config.modifiedUrls?.[props.index] = item;
        props.handleSetShowAlert('success', '更新成功');
      } else {
        return props.handleSetShowAlert('error', 'url已存在');
      }
    } else {
      const foundIndex = config.modifiedUrls?.findIndex((item) => item.url === url);
      if (foundIndex === -1) {
        props.handleSetShowAlert('success', '添加成功');
        config.modifiedUrls?.push(item);
        dispatch({ type: 'name', name: '' });
        dispatch({ type: 'setUrl', url: '' });
        dispatch({ type: 'setJsonText', jsonText: '' });
        dispatch({ type: 'setModifiedJson', modifiedJson: '' });
      } else {
        return props.handleSetShowAlert('error', 'url已存在');
      }
    }
    await setConfig(config);
    props.getStorageConfig();
  };
  return (
    <StyledPanelDetail>
      <div>
        <TextField
          required={true}
          id="standard-basic"
          value={name}
          label="NAME"
          style={{ width: '100%' }}
          onChange={(value) => dispatch({ type: 'name', name: value.target.value })}
        />
      </div>
      <div>
        <TextField
          required={true}
          id="standard-basic"
          value={url}
          label="URL"
          style={{ width: '100%' }}
          onChange={(value) => dispatch({ type: 'setUrl', url: value.target.value })}
        />
      </div>
      <div>
        <TextField
          required={true}
          value={jsonText}
          multiline={true}
          rows={10}
          style={{ width: '100%' }}
          label="需要返回的JSON字符串"
          helperText="可以通过开发者工具的Network面板复制请求的response到此处修改"
          onChange={(value) => {
            dispatch({ type: 'setJsonText', jsonText: value.target.value });
            dispatch({ type: 'setModifiedJson', modifiedJson: value.target.value });
          }}
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleFormat}>
        格式化
      </Button>
      <div
        className="jsoneditor"
        ref={jsonEditor}
        style={{ maxHeight: 700, display: show ? 'block' : 'none' }}
      />
      <Button variant="contained" color="primary" onClick={handleSaveConfig}>
        保存
      </Button>
    </StyledPanelDetail>
  );
}
