import * as React from 'react';
import { useEffect } from 'react';
import { ExpansionPanel, ExpansionPanelDetails, Snackbar } from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@material-ui/icons';
import { StyledExpansionPanelSummary, StyledList, StyledTypography } from './modify-response-style';
import ModifyResponseItem from './modify-reponse-item';
import { getConfig, setConfig as setConfigModel } from '../model';
import { Alert, Color } from '@material-ui/lab';

export default function ModifyResponse() {
  const [expanded, setExpanded] = React.useState<number | false>(false);
  const [config, setConfig] = React.useState<ConfigModel | undefined>();
  const [showAlert, setShowAlert] = React.useState<Color | null>(null);
  const [alertMessage, setAlertMessage] = React.useState('');

  const getStorageConfig = async () => {
    const config = await getConfig();
    setConfig(config);
  };

  useEffect(() => {
    getStorageConfig();
  }, []);

  const handleChange = (index: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? index : false);
  };

  const handleSetShowAlert = (type: Color, message: string) => {
    setShowAlert(type);
    setAlertMessage(message);
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleDeleteItem = async (index: number) => {
    if (config) {
      config.modifiedUrls?.splice(index, 1);
      await setConfigModel(config);
      getStorageConfig();
    }
  };

  const handleEnable = async (index: number, enable: boolean) => {
    if (config && config.modifiedUrls && config.modifiedUrls?.[index]) {
      config.modifiedUrls[index].enable = enable;
      await setConfigModel(config);
      getStorageConfig();
    }
  };

  const addItemIndex = (config?.modifiedUrls?.length || 0) + 1;
  return (
    <div>
      <StyledList>
        {config?.modifiedUrls?.map((item, index) => (
          <ExpansionPanel expanded={expanded === index} onChange={handleChange(index)} key={index}>
            <StyledExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content">
              <StyledTypography>{item.name}</StyledTypography>
              <StyledTypography second={1}>{item.url}</StyledTypography>
              <StyledTypography
                remove={1}
                onClick={(event: { stopPropagation: () => void }) => {
                  event.stopPropagation();
                  handleEnable(index, !item.enable);
                }}>
                {item.enable ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </StyledTypography>
              <StyledTypography
                remove={1}
                onClick={(event: { stopPropagation: () => void }) => {
                  event.stopPropagation();
                  handleDeleteItem(index);
                }}>
                <DeleteIcon />
              </StyledTypography>
            </StyledExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ModifyResponseItem
                modifiedUrl={item}
                index={index}
                isNew={false}
                handleSetShowAlert={handleSetShowAlert}
                getStorageConfig={getStorageConfig}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
        <ExpansionPanel expanded={expanded === addItemIndex} onChange={handleChange(addItemIndex)}>
          <StyledExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content">
            <StyledTypography>新增</StyledTypography>
          </StyledExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ModifyResponseItem
              handleSetShowAlert={handleSetShowAlert}
              isNew={true}
              getStorageConfig={getStorageConfig}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </StyledList>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        key="top, center"
        open={!!showAlert}
        onClose={() => setShowAlert(null)}>
        <Alert
          onClose={() => setShowAlert(null)}
          severity={showAlert || undefined}
          elevation={6}
          variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
