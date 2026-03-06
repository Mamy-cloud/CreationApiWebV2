// type_input.js
import { createBooleanInput } from "./input_radio_boolean.js";

export function mapSqlTypeToHtmlInput(sqlType, i) {
  switch (sqlType.toUpperCase()) {
    case "INTEGER":
    case "REAL":
    case "NUMERIC":
    case "MONEY":
      return { type: "number" };
    case "BOOLEAN":
      // retourne directement un <td> avec les radios
      return { custom: createBooleanInput(i) };
    case "DATE":
      return { type: "date" };
    case "TIMESTAMP":
      return { type: "datetime-local" };
    case "URL":
      return { type: "url" };
    case "EMAIL":
      return { type: "email" };
    default:
      return { type: "text" };
  }
}
