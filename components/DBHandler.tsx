import { SQLiteDatabase } from "expo-sqlite";

type GetProps = {
  queryFields?: string[];
  tableName: string;
  filterFields?: [string, string][] | null;
  db: SQLiteDatabase;
};

export async function Get({
  queryFields = ["*"],
  tableName,
  filterFields,
  db,
}: GetProps) {
  //SQL Statement Creation
  var statement = `SELECT ${queryFields.toString()} FROM ${tableName}`;

  //Statment Filter Parameters
  if (filterFields) {
    statement += " WHERE ";

    for (let i = 0; i < filterFields.length; i++) {
      statement += `${filterFields[i][0]} = ${filterFields[i][1]}`;

      if (i != filterFields.length - 1) {
        statement += " AND ";
      }
    }
  }

  //Attempt to execute SQL request
  try {
    let response = await db.getFirstAsync(statement);

    console.log("SQL Get Command Executed: " + statement);
    console.log("Response: " + JSON.stringify(response));

    return JSON.parse(JSON.stringify(response));
  } catch (e) {
    console.log("SQL Get Command Failed: " + statement);
  }
}
