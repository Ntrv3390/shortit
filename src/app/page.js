"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Url from "@/components/Url";
import { isValidUrl } from "@/lib/validUrl";

export default function Home() {
  const { data: session, status } = useSession();

  const [uri, setUri] = useState("");
  const [userUrl, setUserUrl] = useState([]);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`/api/url?userId=${session.user.id}`);

        if (response.ok) {
          const data = await response.json();
          setUserUrl(data.userUrls);
        }
        return;
      } catch (error) {
        toast.error(`Error while fetching url's: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    };
    if (status === "authenticated") {
      fetchUrl();
    }
  }, [status, session, uri]);

  const handleInput = (e) => {
    setUri(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uri) {
      toast.error("Please enter a url.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!isValidUrl(uri)) {
      toast.error("Please enter a valid url.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uri, userId }),
      });

      if (!response.ok) {
        toast.error("Failed to create URL. Please try again", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      const data = await response.json();
      toast.success(
        `URL created successfully. URL ID: ${data.newUrl.shortId}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setUri("");
      return;
    } catch (error) {
      toast.error(`Error creating URL: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center text-center font-bold text-3xl lg:text-6xl text-[#F4EEE0]">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex gap-8 flex-col justify-center items-center text-center font-bold text-3xl lg:text-6xl text-[#F4EEE0]">
        Please sign-in to create short urls...
      </div>
    );
  }

  const userId = session.user.id;

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-24">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="lg:justify-center justify-start lg:items-center flex flex-col lg:flex-row gap-5">
            <label
              htmlFor="url"
              className="text-[#F4EEE0] text-4xl lg:text-8xl text-left lg:text-center font-bold "
            >
              URL:
            </label>
            <input
              value={uri}
              onChange={handleInput}
              name="url"
              className="w-[20rem] lg:w-[60rem] shadow-lg bg-[#6D5D6E] rounded-2xl p-10 text-3xl text-[#F4EEE0] placeholder:text-[#F4EEE0]"
              placeholder="Enter a url"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#6D5D6E] mt-6 text-[#F4EEE0] font-bold text-3xl w-full rounded-2xl shadow-lg py-6"
          >
            ShortIt
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-24">
        <h3
          htmlFor="url"
          className="text-[#F4EEE0] mb-3 text-4xl lg:text-8xl text-center font-bold "
        >
          Your Short's
        </h3>

        <div className="my-8 p-4 lg:p-0 overflow-x-scroll w-screen lg:w-[60%]">
          <table className="w-full text-sm text-left rtl:text-right text-[#F4EEE0] ">
            <thead className="text-xs bg-[#6D5D6E] uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Short URL
                </th>
                <th scope="col" className="px-6 py-3">
                  Redirect URL
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userUrl &&
                userUrl.map((u, index) => (
                  <Url
                    key={index}
                    id={u._id}
                    shortId={u.shortId}
                    redirectUrl={u.redirectUrl}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
