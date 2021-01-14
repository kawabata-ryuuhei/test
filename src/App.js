import React, { useEffect, useState } from "react";
import "./App.css";
import { Table } from "./components/Table";
import { Button } from "./components/Button";
import { firebaseApp } from "./firebase";
const INITIAL_STUDENTS = [{ id: 1, name: "Bob" }, { id: 2, name: "Amy" }];
function App() {
  const [students, setStudents] = useState([]); //student�̒��ɏ����l������
  const [studentName, setStudentName] = useState("");
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [age, setage] = useState(0);
  const [sort, setSort] = useState(0);
  const perPage = 3;
  let chankArray;
  useEffect(() => {
    const getStudents = async () => {
      const db = firebaseApp.firestore();
      const studentsRef = await db.collection("students").get();
      if (studentsRef.empty) return [];
      const students = [];
      for (const doc of studentsRef.docs) {
        const student = doc.data(); // document�̒��̏��𒊏o
        students.push({ ...student, id: doc.id });
      }
      console.log(students);
      setStudents(students);
    };
    getStudents();
  }, []);
  /** ���k�̒ǉ����s������ */
  const addStudent = async () => {
    if (studentName === "") return alert("Please input name");
    const db = firebaseApp.firestore();
    const studentCollection = db.collection("students");
    // �V�����h�L�������g�̔��s
    const newStudentDocRef = studentCollection.doc();
    // ���s�����h�L�������g�ɑ΂��ăf�[�^���Z�b�g����
    await newStudentDocRef.set({
      name: studentName,
      age: 18
    });
    setStudents([...students, { id: newStudentDocRef.id, name: studentName }]);
    setStudentName("");
  };
  /** ���k�̍폜���s������ */
  const deleteStudent = async studentId => {
    setStudents(
      students.filter(student => {
        return student.id !== studentId;
      })
    );
    // �Ώۂ̃h�L�������g�擾
    const studentDoc = firebaseApp
      .firestore()
      .collection("students")
      .doc(studentId);
    // �擾�����h�L�������g�̍폜
    await studentDoc.delete();
    console.log(studentDoc);
  };
  /** ���k�̃A�b�v�f�[�g���s������ */
  const updateStudent = studentId => {
    const inputVal = prompt("name please: ");
    if (inputVal === "") {
      alert("�A���[�g�̕\��");
      return;
    }
    setStudents(
      students.map(student => {
        if (student.id === studentId) {
          student.name = inputVal;
        }
        return student;
      })
    );
  };

  //���k�̔N��̏����~��
  //ASC�{�^��
  const ascAge = () => {
    setSort(0);
    students.sort((a, b) => (a.id[0] < b.id[0] ? 0 : 1));
    console.log(students);
  };

  /** �y�[�W�l�[�V�����̐ݒ���s������ */
  const pageNationStudent = () => {
    chankArray = students.filter((student, index) => {
      return (
        currentPageNum * perPage <= index &&
        index < perPage * currentPageNum + perPage
      );
    });
    setTotalPages(Math.ceil(students.length / 3));
    return chankArray;
  };
  const prevPageNation = () => {
    //�O�փ{�^��
    setCurrentPageNum(currentPageNum - 1);
  };
  const nextPageNation = () => {
    //���փ{�^��
    setCurrentPageNum(currentPageNum + 1);
  };
  return (
    <div className="App" style={{ maxWidth: "80%", margin: "20px auto" }}>
      <div>
        {/** �����Ő��k�̏���ǉ����邽�߂̃t�B�[���h��p�� */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "30px",
            marginBottom: "50px"
          }}
        >
          <input
            style={{
              width: "80%",
              fontSize: "25px",
              lineHeight: "25",
              height: 30
            }}
            type="text"
            placeholder="userName"
            value={studentName}
            onChange={e => {
              e.preventDefault();
              setStudentName(e.target.value);
            }}
          />
          <Button onClick={addStudent} title="Add student"></Button>
        </div>
      </div>
      <Table
        deleteStudent={deleteStudent}
        students={students}
        updateStudent={updateStudent}
        ascAge={ascAge}
        pageNationStudent={pageNationStudent}
      />
      {/* �����~���{�^���̕\�� */}
      <div className="ascButton">
        <button onClick={ascAge}>ASC</button>
      </div>
      <div className="pageNationButton">
        {currentPageNum >= 1 ? (
          <button onClick={prevPageNation}>prev</button>
        ) : (
          <span>no data</span>
        )}
        {/* �y�[�W�ԍ��̕\�� */}
        <span className="page"> {currentPageNum + 1} </span>
        {totalPages - 1 !== currentPageNum ? (
          <button onClick={nextPageNation}>next</button>
        ) : (
          <span>no data</span>
        )}
        {/* ���y�[�W / ���y�[�W�̕\�� */}
        <div>
          {currentPageNum + 1} / {totalPages}
        </div>
      </div>
    </div>
  );
}
export default App;
