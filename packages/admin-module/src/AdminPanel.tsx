import { useState, type ChangeEvent, type FormEvent } from "react";
import type { TenantConfig, TenantTheme } from "@shipay/types";
import { Button } from "@shipay/design-system";
import styles from "./AdminPanel.module.scss";

export interface AdminPanelProps {
  initialConfig: TenantConfig;
}

/**
 * Admin panel UI demo for tenant configuration.
 * Dynamic theme changes are not yet implemented.
 */
export function AdminPanel({ initialConfig }: AdminPanelProps) {
  const [name, setName] = useState(initialConfig.name);
  const [theme, setTheme] = useState<TenantTheme>(initialConfig.theme);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  const handleThemeChange = (key: keyof TenantTheme) => (e: ChangeEvent<HTMLInputElement>) => {
    setTheme((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage({
      type: "warning",
      text: "Dynamic theme changes are not yet implemented. Our team is working on it!",
    });
  };

  const colorFields: { key: keyof TenantTheme; label: string }[] = [
    { key: "primaryColor", label: "Primary Color" },
    { key: "secondaryColor", label: "Secondary Color" },
    { key: "backgroundColor", label: "Background" },
    { key: "textColor", label: "Text Color" },
  ];

  return (
    <form onSubmit={handleSubmit} className={styles["admin-panel"]}>
      {message && (
        <div
          className={`${styles["admin-panel__message"]} ${styles[`admin-panel__message--${message.type}`]}`}
        >
          {message.text}
        </div>
      )}

      <div className={styles["admin-panel__section"]}>
        <h2 className={styles["admin-panel__title"]}>Basic Info</h2>
        <div className={styles["admin-panel__field"]}>
          <label className={styles["admin-panel__label"]}>Tenant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles["admin-panel__input"]}
          />
        </div>
      </div>

      <div className={styles["admin-panel__section"]}>
        <h2 className={styles["admin-panel__title"]}>Theme Colors</h2>
        <div className={styles["admin-panel__grid"]}>
          {colorFields.map(({ key, label }) => (
            <div key={key} className={styles["admin-panel__field"]}>
              <label className={styles["admin-panel__label"]}>{label}</label>
              <div className={styles["admin-panel__color-row"]}>
                <input
                  type="color"
                  value={theme[key]}
                  onChange={handleThemeChange(key)}
                  className={styles["admin-panel__color-picker"]}
                />
                <input
                  type="text"
                  value={theme[key]}
                  onChange={handleThemeChange(key)}
                  className={styles["admin-panel__input"]}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles["admin-panel__section"]}>
        <h2 className={styles["admin-panel__title"]}>Other</h2>
        <div className={styles["admin-panel__field"]}>
          <label className={styles["admin-panel__label"]}>Border Radius</label>
          <input
            type="text"
            value={theme.borderRadius}
            onChange={handleThemeChange("borderRadius")}
            className={styles["admin-panel__input"]}
            placeholder="0.5rem"
          />
        </div>
      </div>

      <div className={styles["admin-panel__actions"]}>
        <Button type="submit">Save Configuration</Button>
      </div>
    </form>
  );
}
