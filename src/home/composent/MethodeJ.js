// MethodeDesJ.js
import React, { useState, useEffect, useRef } from 'react';
import { DateCalendar, DayCalendarSkeleton } from '@mui/x-date-pickers';
import ServerDay from "./ServerDay.js";
import { Typography } from '@mui/material';
import { getJMethod } from "../../API/jMethodeAPI.js";
import { getTokenAndRole } from "../../services/Cookie.js";
import { decodeJWT } from "../../services/decode.js";

export default function MethodeJ() {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listJMethod, setListJMethod] = useState([]);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());

  const fetchJMethod = async () => {
    setIsLoading(true);
    const controller = new AbortController();
    try {
      const { token } = await getTokenAndRole();
      const tokenInfo = decodeJWT(token);
      if (tokenInfo.consentement === 1) {
        try {
          const JMethod = await getJMethod();
          setListJMethod(JMethod);
          requestAbortController.current = controller;
        } catch (error) {
          console.error('Erreur lors de la récupération de la méthode des J:', error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filteredDates = listJMethod
      .filter(JMethod => new Date(JMethod.date).getMonth() === month)
      .map(JMethod => new Date(JMethod.date));

    const days = filteredDates.map(date => date.getDate());
    setHighlightedDays(days);

    return () => {
      requestAbortController.current?.abort();
    };
  }, [listJMethod, month]);

  useEffect(() => {
    fetchJMethod();
  }, []);

  const handleMonthChange = (date) => {
    setMonth(date.$M);
    fetchJMethod(date.$M);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography style={{ fontFamily: "Shadows Into Light", fontSize: "xx-large" }}>Méthode des J</Typography>
      <DateCalendar
        sx={{ width: { xs: "250px", lg: "330px", md: "100%", sm: "100%" }, margin: {sm: "0px 20px" }, height: "100%" }}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
            listJMethod,
          },
        }}
      />
    </div>
  );
}

