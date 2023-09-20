import { useState } from "react";
import "./SwitchTab.scss";
function SwitchTab({ data, onTabChange }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [left, setLeft] = useState(0);
  const activeTab = (tab, index) => {
    setLeft(index * 100);
    setTimeout(() => {
      setSelectedTab(index);
    }, 300);
    onTabChange(tab, index);
  };
  return (
    <div className="switch-tab">
      <div className="tab-items">
        {data.map((tab, index) => {
          return (
            <span
              onClick={() => activeTab(tab, index)}
              key={index}
              className={`tab-item ${selectedTab == index ? "active" : ""}`}
            >
              {tab}
            </span>
          );
        })}
        <span className="moving-background" style={{ left }}></span>
      </div>
    </div>
  );
}

export default SwitchTab;
