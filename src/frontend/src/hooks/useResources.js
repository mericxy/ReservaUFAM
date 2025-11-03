import { useState, useEffect } from "react";
import { emptyResources } from "../constants/reservation";

export function useResources(formData, handleError) {
  const [resources, setResources] = useState(emptyResources);
  const [occupiedDates, setOccupiedDates] = useState([]);

  const fetchResources = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const urls = [
        ["auditorium", "auditoriums"],
        ["meeting_room", "meeting-rooms"],
        ["vehicle", "vehicles"],
      ];

      const responses = await Promise.all(
        urls.map(([type, endpoint]) =>
          fetch(`http://127.0.0.1:8000/api/resources/${endpoint}/`, { headers })
        )
      );

      if (responses.some((res) => !res.ok)) throw new Error("Erro ao carregar recursos");

      const data = await Promise.all(responses.map((res) => res.json()));

      setResources({
        auditorium: data[0],
        meeting_room: data[1],
        vehicle: data[2],
      });
    } catch (error) {
      console.error(error);
      handleError("Erro ao carregar recursos disponíveis.");
    }
  };

  const fetchOccupiedDates = async () => {
    if (!formData.resource_type || !formData.resource_id) return;
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/resources/occupied-dates/${formData.resource_type}/${formData.resource_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Erro ao carregar datas ocupadas");
      setOccupiedDates(await response.json());
    } catch (error) {
      console.error(error);
      handleError("Erro ao carregar disponibilidade do recurso");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    fetchOccupiedDates();
  }, [formData.resource_type, formData.resource_id]);

  return { resources, occupiedDates };
}
