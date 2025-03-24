import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const questions = [
  {
    id: 1,
    text: {
      es: "¿Tiene antecedentes familiares de dificultades persistentes en el habla (como tartamudez)?",
      ar: "هل يوجد في العائلة تاريخ من مشاكل مستمرة في النطق (مثل التلعثم)؟"
    },
    key: "antecedentes"
  },
  {
    id: 2,
    text: {
      es: "¿Tiene 5 años cumplidos o más?",
      ar: "هل يبلغ من العمر 5 سنوات أو أكثر؟"
    },
    key: "edad"
  },
  {
    id: 3,
    text: {
      es: "¿Han pasado más de 3 meses desde que comenzaron las disfluencias?",
      ar: "هل مر أكثر من 3 أشهر منذ بداية التلعثم؟"
    },
    key: "meses"
  },
  {
    id: 4,
    text: {
      es: "¿Presenta bloqueos, prolongaciones o repeticiones de sonidos o sílabas?",
      ar: "هل يظهر عليه انسدادات أو إطالة أو تكرار للأصوات أو المقاطع؟"
    },
    key: "atipicas"
  },
  {
    id: 5,
    text: {
      es: "¿Muestra reacciones físicas, emocionales o verbales ante las disfluencias? (tensión corporal, frustración, evitación, etc.)",
      ar: "هل يظهر ردود فعل جسدية أو عاطفية أو لفظية عند التلعثم؟ (توتر جسدي، إحباط، تجنب، إلخ)"
    },
    key: "secundarios"
  }
];

export default function AlgoritmoDisfluencias() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [language, setLanguage] = useState("es");

  const handleAnswer = (value) => {
    const currentKey = questions[step].key;
    setAnswers({ ...answers, [currentKey]: value });
    setStep(step + 1);
  };

  const getResult = () => {
    const { antecedentes, edad, meses, atipicas, secundarios } = answers;

    if (antecedentes === "sí" || edad === "sí") return language === "es" ? "Se recomienda consultar con un profesional del habla lo antes posible." : "ننصح بمراجعة أخصائي نطق في أقرب وقت ممكن.";
    if (meses === "sí") return language === "es" ? "Dado que las disfluencias persisten más de 3 meses, es aconsejable valorar con un especialista." : "نظرًا لاستمرار التلعثم لأكثر من 3 أشهر، يُنصح باستشارة مختص.";
    if (atipicas === "sí" || secundarios === "sí") return language === "es" ? "Hay señales de alerta. Es recomendable acudir a consulta especializada." : "توجد مؤشرات إنذار. يُفضل الذهاب لاستشارة متخصصة.";

    return language === "es"
      ? "No se observan indicadores de riesgo importantes por ahora. Realizar seguimiento en 2 meses o antes si cambia la situación."
      : "لا توجد مؤشرات خطر واضحة حالياً. يُنصح بإعادة التقييم بعد شهرين أو قبل ذلك إذا تغيرت الحالة.";
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(language === "es" ? "Informe de evaluación de disfluencias" : "تقرير تقييم التلعثم", 20, 20);
    questions.forEach((q, index) => {
      doc.text(`${index + 1}. ${q.text[language]}: ${answers[q.key]}`, 20, 30 + index * 10);
    });
    doc.text("Resultado:", 20, 90);
    doc.text(getResult(), 20, 100);
    doc.save("informe_disfluencias.pdf");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="flex justify-end mb-4 gap-2">
        <Button variant={language === "es" ? "default" : "outline"} onClick={() => setLanguage("es")}>Español</Button>
        <Button variant={language === "ar" ? "default" : "outline"} onClick={() => setLanguage("ar")}>العربية</Button>
      </div>

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold mb-4">
        {language === "es" ? "Evaluación de disfluencias en la infancia" : "تقييم التلعثم عند الأطفال"}
      </motion.h1>

      {step < questions.length ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg mb-4">{questions[step].text[language]}</p>
            <div className="flex gap-4">
              <Button onClick={() => handleAnswer("sí")}>{language === "es" ? "Sí" : "نعم"}</Button>
              <Button onClick={() => handleAnswer("no")}>{language === "es" ? "No" : "لا"}</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-lg font-medium mb-2">{language === "es" ? "Resultado:" : "النتيجة:"}</p>
              <p className="text-green-700 text-xl font-semibold">{getResult()}</p>
              <Button className="mt-4" onClick={generatePDF}>{language === "es" ? "Descargar informe en PDF" : "تحميل التقرير PDF"}</Button>
              <p className="text-sm text-gray-500 mt-4">
                {language === "es"
                  ? "Esta herramienta está inspirada en modelos de evaluación clínica actuales. No sustituye una evaluación profesional."
                  : "هذه الأداة مستوحاة من نماذج تقييم سريرية حديثة، ولا تُعد بديلاً عن التقييم المهني."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
