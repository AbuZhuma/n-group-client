import styles from "./styles.module.scss"

const Header = () => {
  return (
    <header className={styles.header}>
      <img src="/logo.png" alt="N Group Logo" />
      <p>
{`🎉 N Group празднует 5-летие!
Приглашаем вас на яркое детское мероприятие, полное улыбок, сюрпризов и волшебства!
Только клиентам компании!`}
      </p>
    </header>
  )
}

export default Header
