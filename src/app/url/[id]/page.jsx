"use client";

import { isValidUrl } from "@/lib/validUrl";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const currentDomain = window.location.hostname;
  const { data: session, status } = useSession();
  const { id } = params;
  const router = useRouter();
  const [currUrl, setCurrUrl] = useState({
    redirectUrl: "",
    shortId: "",
  });
  const [editing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`/api/url/${id}`);
        if (!session || !session.user) return;
        const userId = session.user.id;

        if (!userId) return;

        if (response.ok) {
          const data = await response.json();
          const urlUserId = data.userUrls.createdBy;
          if (urlUserId !== userId) {
            toast.error(`You are not authorised to view this.`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            router.push("/");
            return;
          }
          setCurrUrl(data.userUrls);
          setEditValue(data.userUrls.redirectUrl);
          return;
        }
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
    fetchUrl();
  }, [status, session]);
  const handleCopyShortUrl = (e) => {
    e.preventDefault();
    const textToCopy = document.getElementById("shortUrl").innerText;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success(`Text copied to clipboard.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
      (err) => {
        toast.error(`Failed to copy the text: ${err}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    );
  };

  const handleToggleEdit = (e) => {
    e.preventDefault();
    setIsEditing(!editing);
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleEditUrl = async () => {
    try {
      if (!isValidUrl(editValue)) {
        toast.error(`Please enter a valid url.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsEditing(false);
        return;
      }
      const response = fetch(`/api/url/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ redirectUrl: editValue }),
      });
      if (response.ok) {
        toast.error(
          `Error while editing redirect url, please try again later.`,
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
        return;
      }
      toast.success(`Redirect URL edited successfully.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.success(`Failed to edit redirect url: ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteUrl = async () => {
    try {
      const response = fetch(`/api/url/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.error(`Error while deleting url, please try again later.`, {
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
      toast.success(`Short URL deleted successfully.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push("/");
    } catch (error) {
      toast.error(`Failed to delete short url: ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    return;
  };

  if (status === "loading" || (!currUrl && !currUrl.analytics)) {
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
  return (
    <>
      <div className="flex flex-col gap:4 lg:gap-8 justify-center items-center">
        <div className="flex flex-col lg:flex-row gap-5 justify-center items-center">
          <h2 className="text-center text-[#F4EEE0] font-bold text-xl lg:text-4xl">
            ID: {id}{" "}
          </h2>
          <button
            onClick={handleDeleteUrl}
            className="bg-[#F4EEE0] text-[#6D5D6E] rounded-lg px-6 py-4 text-bold"
          >
            Delete
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-8">
          <div className="lg:justify-center mt-10 justify-start lg:items-center flex flex-col lg:flex-row gap-5">
            <label
              htmlFor="url"
              className="text-[#F4EEE0] text-2xl lg:text-8xl text-left lg:text-center font-bold "
            >
              Redirect URL:
            </label>
            <div className="w-[22rem] gap-3 text-lg lg:gap-5 flex flex-col lg:flex-row items-start justify-start lg:justify-between lg:items-center lg:w-[40rem] shadow-lg bg-[#6D5D6E] rounded-2xl p-3 lg:text-3xl text-[#F4EEE0]">
              <input
                className={`${
                  editing ? `border border-[#F4EEE0] rounded-lg` : ``
                } bg-transparent p-4`}
                value={`${editValue}`}
                readOnly={!editing}
                onChange={handleInputChange}
              />
              <button
                onClick={!editing ? handleToggleEdit : handleEditUrl}
                className="bg-[#F4EEE0] text-[#6D5D6E] rounded-lg px-6 py-4 text-bold"
              >
                {editing ? "Save" : "Edit"}
              </button>
            </div>
          </div>

          <div className="lg:justify-center mt-10 justify-start lg:items-center flex flex-col lg:flex-row gap-5">
            <label
              htmlFor="url"
              className="text-[#F4EEE0] text-2xl lg:text-8xl text-left lg:text-center font-bold "
            >
              Short URL:
            </label>
            <div className="w-[22rem] gap-3 text-lg lg:gap-5 flex flex-col lg:flex-row items-start justify-start lg:justify-between lg:items-center lg:w-[40rem] shadow-lg bg-[#6D5D6E] rounded-2xl p-3 lg:text-3xl text-[#F4EEE0]">
              <h6 id="shortUrl">
                {currentDomain}/{currUrl.shortId}
              </h6>
              <button
                onClick={handleCopyShortUrl}
                className="bg-[#F4EEE0] text-[#6D5D6E] rounded-lg px-6 py-4 text-bold"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        <div className="flex mb-10 flex-col justify-center items-center gap-3">
          <h2 className="text-center mt-10 text-[#F4EEE0] font-bold text-5xl">
            Analytics
          </h2>
          <div className="flex gap-3">
            <p className="text-[#F4EEE0] mt-8 text-4xl">
              Total Clicks:{" "}
              {currUrl && currUrl.analytics && currUrl.analytics.length} |
            </p>
            <p className="text-[#F4EEE0] mt-8 text-4xl">
              Unique Users:{" "}
              {
                new Set(
                  currUrl &&
                    currUrl.analytics &&
                    currUrl.analytics.map((u) => u.ipAddress)
                ).size
              }
            </p>
          </div>

          <div className="my-8 p-4 lg:p-0 overflow-x-scroll w-[100%]">
            <table className="w-full text-sm text-left rtl:text-right text-[#F4EEE0] ">
              <thead className="text-xs bg-[#6D5D6E] uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    IP Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Device Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Browser
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Country
                  </th>
                </tr>
              </thead>
              <tbody>
                {currUrl.analytics &&
                  currUrl.analytics.map((a, index) => (
                    <tr
                      key={index}
                      className="bg-[#F4EEE0] border-b text-[#393646]"
                    >
                      <td className="px-6 py-4">{a.ipAddress}</td>
                      <td className="px-6 py-4">{a.deviceType}</td>
                      <td className="px-6 py-4">{a.browser}</td>
                      <td className="px-6 py-4">{a.country}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Page;
