import styles from '../styles/EmptyState.module.css';

const EmptyState = ({ children }) => (
  <div className={styles.emptyState}>
    {children}
  </div>
);

export default EmptyState;
