import styles from "./styles.module.scss"

const Header = () => {
  return (
    <header className={styles.header}>
      <img src="/logo.png" alt="N Group Logo" />
      <p>
{`Детское мероприятие к пятилетию N Group
27 февраля 2026г.
Кыргызский государственный цирк им. А. Изибаева
⚠️ Важно: на всех детей по одной заявке допускается только 1 взрослый сопровождающий`}
      </p>
    </header>
  )
}

export default Header
