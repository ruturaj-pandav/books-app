import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Homepage() {
  let navigate = useNavigate();
  const [authorOrTitle, setAuthorOrTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setloading] = useState(false);

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [books, setbooks] = useState([]);
  const [contentlength, setcontentlength] = useState(0);
  function nextButton() {
    console.log("currentmin max : ",  min, max)
    console.log("content length:  " , contentlength)
    
    if (contentlength - max >= 10) {
        console.log(contentlength - max)
        console.log("more differnece in max")
        console.log("will be setting to : " , min  + 10 , max + 10)
      setMin(min + 10);
      setMax(max + 10);
      
    } else {      console.log(contentlength - max)
        console.log("less differnece in max")
        setMax(contentlength - max);

    }
  }
  function previousButton() {
    if (min >= 10) {
      setMin(min - 10);
      setMax(max - 10);
    }
  }
  async function getResults() {
    setloading(true);

    let url = `https://openlibrary.org/search.json?q=${authorOrTitle}`;
    let response = await axios.get(url);
    if (response.status === 200) {
      setbooks([]);
      setcontentlength(0);
      setbooks(response.data.docs);
      setMax(response.data.docs.length > 10 ? 10 :response.data.docs.length)
      setcontentlength(response.data.docs.length);
      setloading(false);
    }
  }

  function navigateToSubject(subject) {
    subject = subject.toLowerCase();
    navigate(`/subject/${subject}`);
  }
  return (
    <div className="container ">
      <div className="grid grid-cols-5">
        <div className="py-5 px-3  col-span-1 border-r border-gray-200 h-screen ">
          <div className="border-2 rounded border-gray-300  flex flex-end mx-auto  ">
            <input
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
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
          <div className=" p-5 ">
            <div className="border-2 rounded border-gray-300  flex flex-end w-1/3 ">
              <input
                value={authorOrTitle}
                onChange={(e) => {
                  setAuthorOrTitle(e.target.value);
                }}
                placeholder=" search by author or title "
                className=" outline-none px-3 py-1 bg-transparent w-full h-full "
              />
              <span
                onClick={() => {
                  getResults();
                }}
                className="  text-2xl  text-gray-500 cursor-pointer  "
              >
                <ion-icon name="search-outline"></ion-icon>
              </span>
            </div>
            <span className="block my-2 capitalize text-sm cursor-pointer  hover:text-gray-500">
              clear text
            </span>
          </div>
          <div>
            {loading === true ? (
              "Loading"
            ) : (
              <table className="border-collapse border w-3/4  mx-auto ">
                <thead>
                  <tr>
                    {[
                      "Title and sub title",
                      "Author",
                      "Latest publish year",
                      "First publish year",
                    ].map((col, index) => {
                      return <th className="border p-2">{col}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.slice(min, max).map((book, index) => {
                      const unixTimestamp = book.last_modified_i; // Replace with your Unix timestamp
                      const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
                      const year = date.getFullYear(); // Get the year

                      return (
                        <tr>
                          <td className="border p-2">
                            {book.title !== undefined ? book.title : <span className="text-gray-400 text-sm text-center block ">title not found</span>}
                          </td>
                          <td className="border p-2">
                            {book.author_name !== undefined
                              ? book.author_name[0]
                              : <span className="text-gray-400 text-sm text-center block ">author not found</span>}
                          </td>

                          <td className="border p-2">{year}</td>

                          <td className="border p-2">
                            {book.first_publish_year !== undefined
                              ? book.first_publish_year
                              : <span className="text-gray-400 text-sm text-center block ">publish_year not found</span>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <span className="col-span-4 text-center py-3 block ">
                      nothing to show
                    </span>
                  )}
                </tbody>
              </table>
            )}
          </div>
          {books.length > 0 && (
            <div className="flex flex-row-reverse w-3/4 mx-auto  my-8  ">
              <button
                onClick={() => {
                  nextButton();
                }}
                disabled={(max!==0 && contentlength === max)}
                // disabled={!(contentlength - max >= 10)}
                className={`py-1 px-2 rounded bg-blue-400 hover:bg-blue-600 duration-100 cursor-pointer hover:text-white ${
                  (contentlength !== 0 && contentlength === max) &&
                //   !(contentlength - max >= 10) &&
                  "hover:bg-blue-400 hover:text-black  hover:cursor-not-allowed"
                }  `}
              >
                Next
              </button>
              <button
                disabled={!(min >= 10)}
                onClick={() => {
                  previousButton();
                }}
                className={`py-1 px-2 rounded bg-blue-400 hover:bg-blue-600 duration-100 cursor-pointer hover:text-white   mx-3  ${
                  !(min >= 10) &&
                  "hover:bg-blue-400 hover:text-black  hover:cursor-not-allowed"
                }`}
              >
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
