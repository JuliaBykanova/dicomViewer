import React from 'react';
import styles from './header.css';
import { Title } from '../Title';

interface IHeader{
  title: string;
}

export function Header({title}: Readonly<IHeader>) {

  return (
    <div className={styles.header}>
      <Title title={title}/>
    </div>
  );
}
