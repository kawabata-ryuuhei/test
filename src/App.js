import React, { useEffect, useState } from "react";
import "./App.css";
import { Table } from "./components/Table";
import { Button } from "./components/Button";
import { firebaseApp } from "./firebase";
const INITIAL_STUDENTS = [{ id: 1, name: "Bob" }, { id: 2, name: "Amy" }];
function App() {
  const [students, setStudents] = useState([]); //studentの中に初期値を入れる
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
        const student = doc.data(); // documentの中の情報を抽出
        students.push({ ...student, id: doc.id });
      }
      console.log(students);
      setStudents(students);
    };
    getStudents();
  }, []);
  /** 生徒の追加を行う処理 */
  const addStudent = async () => {
    if (studentName === "") return alert("Please input name");
    const db = firebaseApp.firestore();
    const studentCollection = db.collection("students");
    // 新しいドキュメントの発行
    const newStudentDocRef = studentCollection.doc();
    // 発行したドキュメントに対してデータをセットする
    await newStudentDocRef.set({
      name: studentName,
      age: 18
    });
    setStudents([...students, { id: newStudentDocRef.id, name: studentName }]);
    setStudentName("");
  };
  /** 生徒の削除を行う処理 */
  const deleteStudent = async studentId => {
    setStudents(
      students.filter(student => {
        return student.id !== studentId;
      })
    );
    // 対象のドキュメント取得
    const studentDoc = firebaseApp
      .firestore()
      .collection("students")
      .doc(studentId);
    // 取得したドキュメントの削除
    await studentDoc.delete();
    console.log(studentDoc);
  };
  /** 生徒のアップデートを行う処理 */
  const updateStudent = studentId => {
    const inputVal = prompt("name please: ");
    if (inputVal === "") {
      alert("アラートの表示");
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

  //生徒の年齢の昇順降順
  //ASCボタン
  const ascAge = () => {
    setSort(0);
    students.sort((a, b) => (a.id[0] < b.id[0] ? 0 : 1));
    console.log(students);
  };

  /** ページネーションの設定を行う処理 */
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
    //前へボタン
    setCurrentPageNum(currentPageNum - 1);
  };
  const nextPageNation = () => {
    //次へボタン
    setCurrentPageNum(currentPageNum + 1);
  };
  return (
    <div className="App" style={{ maxWidth: "80%", margin: "20px auto" }}>
      <div>
        {/** ここで生徒の情報を追加するためのフィールドを用意 */}
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
      {/* 昇順降順ボタンの表示 */}
      <div className="ascButton">
        <button onClick={ascAge}>ASC</button>
      </div>
      <div className="pageNationButton">
        {currentPageNum >= 1 ? (
          <button onClick={prevPageNation}>prev</button>
        ) : (
          <span>no data</span>
        )}
        {/* ページ番号の表示 */}
        <span className="page"> {currentPageNum + 1} </span>
        {totalPages - 1 !== currentPageNum ? (
          <button onClick={nextPageNation}>next</button>
        ) : (
          <span>no data</span>
        )}
        {/* 現ページ / 総ページの表示 */}
        <div>
          {currentPageNum + 1} / {totalPages}
        </div>
      </div>
    </div>
  );
}
export default App;
