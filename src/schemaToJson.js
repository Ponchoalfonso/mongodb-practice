const mysqlConnection = require('./connections/mysql');

const schemaToJson = (client, db) => {
  getBuildings(mysqlConnection, db);
  getEmployees(mysqlConnection, db);
  const interval = setInterval(() => {
    if (mysqlConnection.state === 'disconnected') {
      client.close();
      console.log('Finished!');
      clearInterval(interval);
    }
  }, 100);
}

const getEmployees = (mysqlconn, mdb) => {
  mysqlconn.query('select * from TRABAJADOR;', (err, rows) => {
    const employees = [];

    if (err) throw err;
    for (const employee of rows) {
      employees.push({
        id: employee['ID_TRABAJADOR'],
        name: employee['NOMB_TRABAJADOR'],
        salary: employee['TARIFA_HR'],
        job: employee['OFICIO'],
        supervisor_id: employee['ID_SUPV'],
        assignments: [],
      });
    }

    getAssigmnets(employees, mysqlconn, mdb);
  });
}

const getAssigmnets = (employees, mysqlconn, mdb) => {
  for (const employee of employees) {
    const query = `select * from ASIGNACION where ID_TRABAJADOR = ${employee.id};`
    mysqlconn.query(query, (err, rows) => {
      if (err) throw err;
      for (const assignment of rows) {
        employee.assignments.push({
          building_id: assignment['ID_EDIFICIO'],
          start_date: new Date(assignment['FECHA_INICIO']),
          total_days: assignment['NUM_DIAS'],
        });
      }

      postToMongo(employee, mdb, 'employees');
    });
  }

  mysqlconn.end();
}

const getBuildings = (mysqlconn, mdb) => {
  mysqlconn.query('select * from EDIFICIO;', (err, rows) => {
    const buildings = [];

    if (err) throw err;
    for (const building of rows) {
      buildings.push({
        id: building['ID_EDIFICIO'],
        address: building['DIR_EDIFICIO'],
        type: building['TIPO'],
        quality_level: building['NIVEL_CALIDAD'],
        category: building['CATEGORIA']
      });
    }

    for (const building of buildings) {
      postToMongo(building, mdb, 'buildings');
    }
  });
}

const postToMongo = (value, mdb, collection) => {
  mdb.collection(collection).insertOne(value);
}

module.exports = schemaToJson;

/* * * * * * * * * * 
 *  Data structure! *
 * * * * * * * * * */
const employee = {
  id: 0,
  name: 'some name',
  salary: 0,
  job: 'some office type',
  supervisor_id:  0,
  assignments: [
    { building_id: 0, start_date: 'some date', total_days: 0}
  ],
}

const building = {
  address: 'some address',
  type: 'some type',
  quality_level: 0,
  category: 0,
}