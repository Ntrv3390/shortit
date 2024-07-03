"use client";

import React, { useEffect } from "react";

const page = ({ params }) => {
  const { id } = params;
  useEffect(() => {
    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent;
      let browser = "Unknown";
      let deviceType = "Unknown";

      if (userAgent.indexOf("Firefox") > -1) {
        browser = "Firefox";
      } else if (
        userAgent.indexOf("Opera") > -1 ||
        userAgent.indexOf("OPR") > -1
      ) {
        browser = "Opera";
      } else if (userAgent.indexOf("Trident") > -1) {
        browser = "Internet Explorer";
      } else if (userAgent.indexOf("Edge") > -1) {
        browser = "Edge";
      } else if (userAgent.indexOf("Chrome") > -1) {
        browser = "Chrome";
      } else if (userAgent.indexOf("Safari") > -1) {
        browser = "Safari";
      }

      if (userAgent.indexOf("Win") > -1) {
        deviceType = "Windows";
      } else if (userAgent.indexOf("Mac") > -1) {
        deviceType = "MacOS";
      } else if (userAgent.indexOf("X11") > -1) {
        deviceType = "UNIX";
      } else if (userAgent.indexOf("Linux") > -1) {
        deviceType = "Linux";
      } else if (userAgent.indexOf("Android") > -1) {
        deviceType = "Android";
      } else if (userAgent.indexOf("like Mac") > -1) {
        deviceType = "iOS";
      }

      return { browser, deviceType };
    };
    const fetchUrl = async () => {
      try {
        const response = await fetch(`/api/url/${id}`);
        if (response.ok) {
          const data = await response.json();
          redirectUser(data.userUrls.redirectUrl);
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
    const redirectUser = (url) => {
      window.location.href = url;
      return;
    };
    const getIpAddress = async () => {
      let ipAddress = "Unknown";
      let country = "Unknown";
      try {
        const response = await fetch("http://ip-api.com/json");
        const data = await response.json();
        if (data.status === "success") {
          ipAddress = data.query;
          country = data.country;
        }
      } catch (error) {
        throw new Error("Error in redirecting...");
      }
      return { ipAddress, country };
    };
    const handleEditUrl = async (analytics) => {
      try {
        const response = await fetch(`/api/url/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ analytics }),
        });
        if (response.ok) {
          fetchUrl();
          return;
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    const mergeInfo = async () => {
      const ipInfo = await getIpAddress();
      const browserInfo = getBrowserInfo();
      let date = new Date().toISOString();
      const analytics = { ...ipInfo, ...browserInfo, date: date };
      handleEditUrl(analytics);
    };
    mergeInfo();
  }, []);
  return (
    <div className="flex justify-center items-center text-center font-bold text-3xl lg:text-6xl text-[#F4EEE0]">
      Redirecting...
    </div>
  );
};

export default page;
