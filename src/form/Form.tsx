import { useState } from "react"
import "./styles.scss"
import { sendForm } from "../services/sendForm"
import { toast } from "react-toastify"

type Child = {
    full_name: string
    age: string
    birthCertificate: File | null
}

type RegistrationFormProps = {}

const OBJECTS = [
    "Gravity",
    "Meridian",
    "Element",
    "Atmos",
    "Art Square",
    "Vogue"
]

export default function RegistrationForm(props: RegistrationFormProps) {
    const [children, setChildren] = useState<Child[]>([])
    const [childrenCount, setChildrenCount] = useState<number>(0)
    const [selectedObjects, setSelectedObjects] = useState<string[]>([])
    const [isShareholder, setIsShareholder] = useState<boolean>(true)
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [contractNumber, setContractNumber] = useState("")
    const [totalChildren, setTotalChildren] = useState<number>(0)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const toggleObject = (object: string) => {
        setSelectedObjects((prev) =>
            prev.includes(object)
                ? prev.filter((item) => item !== object)
                : [...prev, object]
        )
    }

    const clear = () => {
        setChildren([])
        setChildrenCount(0)
        setSelectedObjects([])
        setIsShareholder(true)
        setFullName("")
        setPhone("")
        setContractNumber("")
        setTotalChildren(0)
        setErrors({})
    }

    const handleChildrenCountChange = (count: number) => {
        setChildrenCount(count)
        const updated = Array.from({ length: count }, (_, i) => ({
            full_name: children[i]?.full_name || "",
            age: children[i]?.age || "",
            birthCertificate: children[i]?.birthCertificate || null,
        }))
        setChildren(updated)
    }

    const handleChildChange = (index: number, field: keyof Child, value: any) => {
        const updated = [...children]
        updated[index][field] = value
        setChildren(updated)
    }

    const addChildManually = () => {
        setChildren([...children, { full_name: "", age: "", birthCertificate: null }])
        setChildrenCount(children.length + 1)
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!fullName.trim()) newErrors.fullName = "Введите ФИО"

        if (!phone.trim()) {
            newErrors.phone = "Введите телефон"
        } else if (!/^\+?\d{9,15}$/.test(phone)) {
            newErrors.phone = "Некорректный номер телефона"
        }

        if (!isShareholder) newErrors.isShareholder = "Выберите вариант"

        if (isShareholder && selectedObjects.length === 0) {
            newErrors.selectedObjects = "Выберите хотя бы один объект"
        }

        if (totalChildren < 0) newErrors.totalChildren = "Количество детей не может быть отрицательным"

        if (childrenCount < 0) newErrors.childrenCount = "Некорректное число"

        if (childrenCount > totalChildren) {
            newErrors.childrenCount =
                "Количество приходящих детей не может быть больше общего количества"
        }

        children.forEach((child, index) => {
            if (!child.full_name.trim())
                newErrors[`child_fullName_${index}`] = "Введите ФИО ребенка"
            if (!child.age || Number(child.age) <= 0)
                newErrors[`child_age_${index}`] = "Введите корректный возраст"
            if (!child.birthCertificate)
                newErrors[`child_file_${index}`] = "Загрузите свидетельство"
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        const formData = new FormData()
        const childrens = children.map((el) => {
            const { birthCertificate, ...rest } = el
            if (birthCertificate) {
                formData.append("files", birthCertificate)
            }
            return rest
        })

        const payload = {
            full_name: fullName,
            whatsapp_phone: phone,
            is_investor: isShareholder,
            objects: selectedObjects,
            contract_number: contractNumber,
            children_total: totalChildren,
            children_coming: childrenCount,
            children: childrens,
            consent: true
        }   
        formData.append("payload", JSON.stringify(payload))
        const res = await sendForm(formData)
        if(res){
            toast.success("Заявка отправлена!")
            clear()
        }
    }

    return (
        <div className="registration-form">
            <h1>N Group — Регистрация на мероприятие</h1>
            <div className="form-group">
                <label>Ваше ФИО</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
                <label>Телефон (WhatsApp)</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
                <label>Вы являетесь дольщиком N Group?</label>
                <div className="shareholder-toggle">
                    <div
                        className={`toggle-card ${isShareholder ? "active" : ""}`}
                        onClick={() => setIsShareholder(true)}
                    >
                        Да
                    </div>
                    <div
                        className={`toggle-card ${!isShareholder ? "active" : ""}`}
                        onClick={() => setIsShareholder(false)}
                    >
                        Нет
                    </div>
                </div>
                {errors.isShareholder && <span className="error">{errors.isShareholder}</span>}
            </div>

            <div className="form-group">
                <label>В каком объекте вы являетесь дольщиком?</label>
                <div className="object-grid">
                    {OBJECTS.map((obj) => (
                        <div
                            key={obj}
                            className={`object-card ${selectedObjects.includes(obj) ? "active" : ""}`}
                            onClick={() => toggleObject(obj)}
                        >
                            {obj}
                        </div>
                    ))}
                </div>
                {errors.selectedObjects && <span className="error">{errors.selectedObjects}</span>}
            </div>

            <div className="form-group">
                <label>Номер договора (не обязательно)</label>
                <input
                    type="text"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Сколько у вас всего детей?</label>
                <input
                    type="text"
                    value={totalChildren}
                    onChange={(e) => setTotalChildren(+e.target.value)}
                />
                {errors.totalChildren && <span className="error">{errors.totalChildren}</span>}
            </div>

            <div className="form-group">
                <label>Сколько детей придут 1 марта?</label>
                <input
                    type="text"
                    value={childrenCount}
                    onChange={(e) => handleChildrenCountChange(+e.target.value)}
                />
                {errors.childrenCount && <span className="error">{errors.childrenCount}</span>}
            </div>

            {children.map((child, index) => (
                <div key={index} className="child-block">
                    <h3>Ребенок {index + 1}</h3>

                    <div className="form-group">
                        <label>ФИО</label>
                        <input
                            type="text"
                            value={child.full_name}
                            onChange={(e) => handleChildChange(index, "full_name", e.target.value)}
                        />
                        {errors[`child_fullName_${index}`] && (
                            <span className="error">{errors[`child_fullName_${index}`]}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Возраст</label>
                        <input
                            type="text"
                            value={child.age}
                            onChange={(e) => handleChildChange(index, "age", e.target.value)}
                        />
                        {errors[`child_age_${index}`] && (
                            <span className="error">{errors[`child_age_${index}`]}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Свидетельство о рождении</label>
                        <input
                            type="file"
                            onChange={(e) =>
                                handleChildChange(index, "birthCertificate", e.target.files?.[0] || null)
                            }
                        />
                        {errors[`child_file_${index}`] && (
                            <span className="error">{errors[`child_file_${index}`]}</span>
                        )}
                    </div>
                </div>
            ))}
            <div className="btns">
                <button type="button" className="add-child-btn" onClick={addChildManually}>
                    + Добавить ребенка
                </button>

                <button type="button" className="submit-btn" onClick={handleSubmit}>
                    Отправить заявку
                </button>
            </div>
        </div>
    )
}
