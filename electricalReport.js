<%
var DEV_MODE = customWebTemplate.access.enable_anonymous_access;
if (DEV_MODE) {
  Request.AddRespHeader("Access-Control-Allow-Origin", "*", false);
  Request.AddRespHeader("Access-Control-Expose-Headers", "Error-Message");
  Request.AddRespHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  Request.AddRespHeader("Access-Control-Allow-Credentials", "true");
}
Request.RespContentType = "application/json";
Request.AddRespHeader("Content-Security-Policy", "frame-ancestors 'self'");
Request.AddRespHeader("X-XSS-Protection", "1");
Request.AddRespHeader("X-Frame-Options", "SAMEORIGIN");

/* --- global --- */
var curUserId = DEV_MODE
  ? OptInt("7079554317075315721") // id пользователя
  : OptInt(Request.Session.Env.curUserID);
var curUser = DEV_MODE ? tools.open_doc(curUserId).TopElem : Request.Session.Env.curUser;
var eventsList = [
  {
    id: 1,
    name: 'электри'
  },
  {
    id: 2,
    name: 'кабел'
  },
  {
    id: 3,
    name: 'теплый пол'
  },
  {
    id: 4,
    name: 'гофр'
  },
  {
    id: 5,
    name: 'Модульн'
  },
  {
    id: 6,
    name: 'Электротехническ'
  },
  {
    id: 7,
    name: 'электроснабжен'
  },
  {
    id: 8,
    name: 'Освещени'
  },
  {
    id: 9,
    name: 'Свет'
  },
  {
    id: 10,
    name: 'Пожарн'
  },
  {
    id: 11,
    name: 'КНС'
  },
  {
    id: 12,
    name: 'молни'
  },
  {
    id: 13,
    name: 'щит'
  },
  {
    id: 14,
    name: 'Электроустановк'
  },
  {
    id: 15,
    name: 'Заземл'
  },
  {
    id: 16,
    name: 'Электроутанов'
  }
]

/* --- utils --- */
function getParam(name) {
  return tools_web.get_web_param(curParams, name, undefined, 0);
}
/**
* Выбирает все записи sql запроса
* @param {string} query - sql-выражение
*/
function selectAll(query) {
  return ArraySelectAll(tools.xquery("sql: " + query));
}
/**
* Выбирает первую запись sql запроса
* @param {string} query - sql-выражение
* @param {any} defaultObj - значение по умолчанию
*/
function selectOne(query, defaultObj) {
  if (defaultObj === void 0) { defaultObj = undefined; }
  return ArrayOptFirstElem(tools.xquery("sql: " + query), defaultObj);
}
/**
* Создает поток ошибки с объектом error
* @param {Object} errorObject - код ошибки
*/
function throwHttpError(errorObject) {
  throw new Error (EncodeJson(errorObject))
}

var logConfig = {
  code: "electrical_report_log",
  type: "electrical_report",
  id: customWebTemplate.id
}

function log(message, type) {
  type = IsEmptyValue(type) ? "INFO" : StrUpperCase(type);

  if (ObjectType(message) === "JsObject" || ObjectType(message) === "JsArray" || ObjectType(message) === "XmLdsSeq" || ObjectType(message) === "XmElem") {
    message = tools.object_to_text(message, "json")
  }

  var log = "["+type+"]["+logConfig.type+"]["+logConfig.id+"]: "+message;

  if(!DEV_MODE) {
    alert(log)
  } else {
    EnableLog(logConfig.code, true)
    LogEvent(logConfig.code, log);
    EnableLog(logConfig.code, false)
  }  
}

function getErrorMessage(error) {
  if (IsEmptyValue(error)) {
    return "Unknown error";
  }

  if (!IsEmptyValue(error.message)) {
    return "" + error.message;
  }

  return "" + error;
}

function getClientError(error) {
  if (IsEmptyValue(error)) {
    return undefined;
  }

  var rawMessage = getErrorMessage(error);
  if (IsEmptyValue(rawMessage)) {
    return undefined;
  }

  try {
    var parsed = tools.read_object(rawMessage);
    if (ObjectType(parsed) == "JsObject" && parsed.isClientError) {
      return parsed;
    }
  } catch (e) {}

  return undefined;
}

function sendJson(res, status, payload) {
  Request.SetRespStatus(status, "");
  res.Write(tools.object_to_text(payload, "json"));
}

function readJsonBody(bodyText) {
  if (IsEmptyValue(bodyText)) { return undefined; }
  try {
    return tools.read_object(bodyText);
  } catch (e) {
    throwHttpError({
      code: 400,
      message: "Invalid JSON body",
      isClientError: true
    });
  }
}

function buildDateFilter(fieldName, startDate, finishDate) {
  var conditions = [];
  if (!IsEmptyValue(startDate)) {
    conditions.push(fieldName + " >= '" + startDate + "'");
  }
  if (!IsEmptyValue(finishDate)) {
    conditions.push(fieldName + " <= '" + finishDate + "'");
  }
  if (conditions.length > 0) {
    return " AND " + conditions.join(" AND ");
  }
  return "";
}

/* --- logic --- */

function getFiltersData() {
  var electricCoursesList = getParam("ELECTRIC_COURSES_LIST")
  var electricTestsList = getParam("ELECTRIC_TESTS_LIST")

  var coursesList = selectAll("SELECT c.id, c.name FROM courses c CROSS APPLY c.role_id.nodes('/role_id') AS R(x) WHERE R.x.value('.', 'varchar(50)') = '" + electricCoursesList + "'")
  var testsList = selectAll("SELECT c.id, c.title AS name FROM assessments c CROSS APPLY c.role_id.nodes('/role_id') AS R(x) WHERE R.x.value('.', 'varchar(50)') = '" + electricTestsList + "'")
  var subdivisionList = ArraySelectDistinct(selectAll("SELECT id, name, name FROM subdivisions WHERE org_id = '7364654937381434225'"), "name");

  return {
    coursesList: coursesList,
    testsList: testsList,
    subdivisionList: subdivisionList,
    eventsList: eventsList
  }
}

function getData(subdivision, positionName, selectedDate, selectedCourse, selectedTest, selectedEvent) {
  var defaultCourseIds = ['6685212163836297874', '6823722664272347136', '6847006998186180746', '6847007036622718974', '7179953191711046630', '7376255060418044462'];
  var defaultTestIds = ['6334554782428837454', '6334555253924642396'];
  var subdivisionFilter = ""
  var positionNameFilters = ""
  var selectedCoursesId = ""
  var selectedTestsId = ""
  var eventNameFilter = "";

  if(ArrayCount(subdivision) > 0) {
    var ids = ArrayExtractKeys(subdivision, 'id')
    var idsString = ids.join(', ');
    subdivisionFilter = "AND c.position_parent_id IN (" + idsString + ")"
  }

  if(positionName !== '') {
    positionNameFilters = "AND c.position_name LIKE '%"+positionName+"%'"
  }

  var dateFilter = "";
  if (!IsEmptyValue(selectedDate.start_date) || !IsEmptyValue(selectedDate.finish_date)) {
    var conditions = [];
    if (!IsEmptyValue(selectedDate.start_date)) {
      conditions.push("src.start_usage_date >= '" + selectedDate.start_date + "'");
    }
    if (!IsEmptyValue(selectedDate.finish_date)) {
      conditions.push("src.start_usage_date <= '" + selectedDate.finish_date + "'");
    }
    if (conditions.length > 0) {
      dateFilter = " AND " + conditions.join(" AND ");
    }
  }

  var eventDateFilter = "";
  if (!IsEmptyValue(selectedDate.start_date) || !IsEmptyValue(selectedDate.finish_date)) {
    var eventConditions = [];
    if (!IsEmptyValue(selectedDate.start_date)) {
      eventConditions.push("ec.start_date >= '" + selectedDate.start_date + "'");
    }
    if (!IsEmptyValue(selectedDate.finish_date)) {
      eventConditions.push("ec.start_date <= '" + selectedDate.finish_date + "'");
    }
    if (eventConditions.length > 0) {
      eventDateFilter = " AND " + eventConditions.join(" AND ");
    }
  }

  if (ArrayCount(selectedCourse) > 0) {
    var courseIds = ArrayExtractKeys(selectedCourse, 'id');
    var courseIdsString = courseIds.join(', ');
    selectedCoursesId = "AND src.course_id IN (" + courseIdsString + ")";
  } else {
    selectedCoursesId = "AND src.course_id IN ('" + defaultCourseIds.join("', '") + "')";
  }

  if (ArrayCount(selectedTest) > 0) {
    var testIds = ArrayExtractKeys(selectedTest, 'id');
    var testIdsString = testIds.join(', ');
    selectedTestsId = "AND src.assessment_id IN (" + testIdsString + ")";
  } else {
    selectedTestsId = "AND src.assessment_id IN ('" + defaultTestIds.join("', '") + "')";
  }

  if(ArrayCount(selectedEvent) > 0) {
    var eventsName = ArrayExtractKeys(selectedEvent, 'name')
    var likeConds = [];
    for(item in eventsName) {
      likeConds.push("LOWER(ec.name) LIKE LOWER('%" + item + "%')");
    }
    if (likeConds.length > 0) {
      eventNameFilter = " AND (" + likeConds.join(" OR ") + ")";
    }
  } else {
    var defaultEventsName = ArrayExtractKeys(eventsList, 'name')
    var defaultLikeConds = [];
    for(item in defaultEventsName) {
      defaultLikeConds.push("LOWER(ec.name) LIKE LOWER('%" + item + "%')");
    }
    if (defaultLikeConds.length > 0) {
      eventNameFilter = " AND (" + defaultLikeConds.join(" OR ") + ")";
    }
  }

  var strQuery = "\
    SELECT\
      c.fullname AS fullname,\
      c.code AS code,\
      c.position_parent_name AS positionParentName,\
      c.position_name AS positionName,\
      FORMAT(c.hire_date, 'dd.MM.yyyy') AS hireDate,\
      'Курс' AS itemType,\
      src.course_name AS itemName,\
      FORMAT(src.start_usage_date, 'dd.MM.yyyy') AS startUsageDate,\
      FORMAT(src.last_usage_date, 'dd.MM.yyyy') AS lastUsageDate,\
      src.score AS score,\
      CASE \
        WHEN src.state_id = 0 THEN 'Назначен'\
        WHEN src.state_id = 1 THEN 'В процессе'\
        WHEN src.state_id = 2 THEN 'Завершён'\
        WHEN src.state_id = 3 THEN 'Не пройден'\
        WHEN src.state_id = 4 THEN 'Пройден'\
        WHEN src.state_id = 5 THEN 'Просмотрен'\
      END AS stateDescription\
    FROM (\
      SELECT course_id, start_usage_date, last_usage_date, score, person_id, state_id, course_name\
      FROM learnings\
      UNION ALL\
      SELECT course_id, start_usage_date, last_usage_date, score, person_id, state_id, course_name\
      FROM active_learnings\
    ) src\
    JOIN collaborators c ON src.person_id = c.id\
    WHERE c.is_dismiss = 0\
      AND c.org_id = '7364654937381434225'\
      " + subdivisionFilter + "\
      " + positionNameFilters + "\
      " + dateFilter + "\
      " + selectedCoursesId + "\
    UNION ALL\
    SELECT\
      c.fullname AS fullname,\
      c.code AS code,\
      c.position_parent_name AS positionParentName,\
      c.position_name AS positionName,\
      FORMAT(c.hire_date, 'dd.MM.yyyy') AS hireDate,\
      'Тест' AS itemType,\
      src.assessment_name AS itemName,\
      FORMAT(src.start_usage_date, 'dd.MM.yyyy') AS startUsageDate,\
      FORMAT(src.last_usage_date, 'dd.MM.yyyy') AS lastUsageDate,\
      src.score AS score,\
      CASE \
        WHEN src.state_id = 0 THEN 'Назначен'\
        WHEN src.state_id = 1 THEN 'В процессе'\
        WHEN src.state_id = 2 THEN 'Завершён'\
        WHEN src.state_id = 3 THEN 'Не пройден'\
        WHEN src.state_id = 4 THEN 'Пройден'\
        WHEN src.state_id = 5 THEN 'Просмотрен'\
      END AS stateDescription\
    FROM (\
      SELECT assessment_id, start_usage_date, last_usage_date, score, person_id, state_id, assessment_name\
      FROM test_learnings\
      UNION ALL\
      SELECT assessment_id, start_usage_date, last_usage_date, score, person_id, state_id, assessment_name\
      FROM active_test_learnings\
    ) src\
    JOIN collaborators c ON src.person_id = c.id\
    WHERE c.is_dismiss = 0\
      AND c.org_id = '7364654937381434225'\
      " + subdivisionFilter + "\
      " + positionNameFilters + "\
      " + dateFilter + "\
      " + selectedTestsId + "\
    UNION ALL\
    SELECT\
      c.fullname AS fullname,\
      c.code AS code,\
      c.position_parent_name AS positionParentName,\
      c.position_name AS positionName,\
      FORMAT(c.hire_date, 'dd.MM.yyyy') AS hireDate,\
      'Мероприятие' AS itemType,\
        ec.name AS itemName,\
      FORMAT(ec.start_date, 'dd.MM.yyyy') AS startUsageDate,\
      FORMAT(ec.finish_date, 'dd.MM.yyyy') AS lastUsageDate,\
      NULL AS score,\
      CASE\
        WHEN er.is_assist = 1 THEN 'Был'\
        ELSE 'Не был'\
      END AS stateDescription\
      FROM event_collaborators ec\
      JOIN collaborators c ON ec.collaborator_id = c.id\
      JOIN event_results er ON er.person_id = c.id\
      WHERE c.is_dismiss = 0\
      AND c.org_id = '7364654937381434225'\
      " + eventNameFilter + " \
      " + subdivisionFilter + "\
      " + positionNameFilters + "\
      " + eventDateFilter + "\
  "

  try {
    var data = selectAll(strQuery)
    return data
  } catch (error) {
    throw error;
  }
}

function handler(body, method, query) {
  switch (method) {
    case 'getFiltersData': {
      var data = getFiltersData()
      return { status: 200, body: data };
    }
    case 'getData': {
      var subdivision = body.GetOptProperty("selectedSubdivisions");
      var positionName = body.GetOptProperty("positionName")
      var selectedDate = body.GetOptProperty("selectedDate")
      var selectedCourse = body.GetOptProperty("selectedCourses")
      var selectedTest = body.GetOptProperty("selectedTests")
      var selectedEvent = body.GetOptProperty("selectedEvents")

      var data = getData(subdivision, positionName, selectedDate, selectedCourse, selectedTest, selectedEvent)
      return { status: 200, body: data };
    }
    default:
      throwHttpError({code: 400, message: "Unknown method: " + method})
  }
}

function main(req, res) {
  try {
    var body = readJsonBody(req.Body);

    var method = req.Query.GetOptProperty("method", "");
    if (IsEmptyValue(method)) {
      throwHttpError({code: 400, message: "unknown method", isClientError: true});
    }
    var result = handler(body, method, req.Query);
    sendJson(res, OptInt(result.status, 200), result.body)
  }
  catch (error) {
    var clientError = getClientError(error);
    var errorMessage = getErrorMessage(error);

    if(clientError != null && clientError.isClientError) {
      sendJson(res, clientError.code, {code: clientError.code, message: clientError.message})
      log("Client error " + clientError.code + ": " + clientError.message, "WARN")
    } else {
      sendJson(res, 500, { code: 500, message: "Internal Server Error" })
      log("Server error: " + errorMessage, "ERROR")
    }
  }
}
main(Request, Response);
%>
