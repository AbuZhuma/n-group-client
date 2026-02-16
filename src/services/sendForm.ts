import axios from "axios";
const API_URL = "https://gn.kassir.kg/api"

export const sendForm = async (data: FormData) => {
    try {
        await axios.post(
            `${API_URL}/public/applications`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return true
    } catch (error) {
        console.error("Ошибка:", error);
        return false
    }
}