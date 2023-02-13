import styles from "./styles.module.scss";
const Header = () => {

  return (
    <div className="grid wide">
      <div className="row">
        <div className="col l-o-3 l-6 m-o-3 m-6 c-12">
          <h1 className={styles.header}>Todos App</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
