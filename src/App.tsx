import { ToastContainer } from "react-toastify"
import "./App.scss"

import RegistrationForm from "./form/Form"
import Header from "./header/Header"

export default function App() {
  return (
    <div className="landing">
      <ToastContainer />
      <div className="container">
        <Header />
        <RegistrationForm />
      </div>
    </div>
  )
}
