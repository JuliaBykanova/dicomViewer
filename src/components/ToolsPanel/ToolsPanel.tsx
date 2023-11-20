import React, { useState } from 'react';
import styles from './toolspanel.css';
import { ITool } from '../../pages/MainPage';
import classNames from 'classnames';

interface IToolsPanel{
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<string>>;
  tools: ITool[];
}

export function ToolsPanel({tool, setTool, tools}: IToolsPanel) {

  const toolsBtn = classNames(
    { 
      [styles['toolsBtn']]: true,
      [styles['activeToolsBtn']]: false,
    }
  );

  function handleClick(event: React.MouseEvent<HTMLButtonElement>){
    setTool(event.currentTarget.value);
  }

  return (
    <div className={styles.toolsPanel}>
      {tools.map((item, index) => {
        return <button key={index} className={item.name===tool ? styles.activeToolsBtn : styles.toolsBtn} value={item.name} onClick={handleClick}>{item.name}</button>
      })}
    </div>
  );
}
