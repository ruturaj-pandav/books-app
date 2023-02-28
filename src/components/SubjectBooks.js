import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function SubjectBooks() {
  const { subject } = useParams();
  const [books, setbooks] = useState([]);
  let navigate = useNavigate();
  function navigateToSubject(subject) {
    setbooks([]);
    subject = subject.toLowerCase();
    navigate(`/subject/${subject}`);
  }
  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    getBooks();
  }, [subject]);
  async function getBooks() {
    console.log("getting books");
    let url = `http://openlibrary.org/subjects/${subject}.json`;
    let response = await axios.get(url);

    if (response.status === 200) {
      let data = response.data.works.slice(0, 10);
      setbooks([]);
      setbooks(data);
    }
  }

  return (
    <div className="container ">
      <div className="grid grid-cols-5">
        <div className="py-5 px-3  col-span-1 border-r border-gray-200 h-screen ">
          <div className="border-2 rounded border-gray-300  flex flex-end mx-auto  ">
            <input
              //   value={authorOrTitle}
              //   onChange={(e) => {
              //     setAuthorOrTitle(e.target.value);
              //   }}
              placeholder=" search by subject "
              className=" outline-none px-3 py-1 bg-transparent w-full h-full "
            />
            <span className="  text-2xl  text-gray-500 cursor-pointer  ">
              <ion-icon name="search-outline"></ion-icon>
            </span>
          </div>
          <div className="my-5 ">
            {["Thriller", "Romance", "Action", "Horror", "Adventure"].map(
              (sub, index) => {
                return (
                  <span
                    onClick={() => {
                      navigateToSubject(sub);
                    }}
                    className=" text-xl hover:text-gray-500 duration-100 my-2  text-gray-800 cursor-pointer block text-start "
                  >
                    {sub}
                  </span>
                );
              }
            )}
          </div>
        </div>
        <div className="col-span-4 text-start   ">
          <div className="border p-5 font-semibold text-xl  ">
            {subject.toUpperCase()} books
          </div>
          {books.length > 0 ? (
            <div>
              <table class="border-collapse border w-3/4  mx-auto ">
                <thead>
                  <tr>
                    {[
                      "Title and sub title",
                      "Author",
                      "Latest publish year",
                      "First publish year",
                    ].map((col, index) => {
                      return <th class="border p-2">{col}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => {
                    return (
                      <tr>
                        <td class="border p-2">{book.title}</td>
                        <td class="border p-2">{book.authors[0].name}</td>
                        <td class="border p-2">-</td>
                        <td class="border p-2">{book.first_publish_year}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            "getting results"
          )}
        </div>
      </div>
    </div>
  );
}
