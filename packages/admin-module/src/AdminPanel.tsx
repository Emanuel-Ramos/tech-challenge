import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { TenantConfig, TenantTheme } from "@shipay/types";
import { Button } from "@shipay/design-system";
import styles from "./AdminPanel.module.scss";

const STORAGE_KEY = "shipay_admin_config";

export interface AdminPanelProps {
  initialConfig: TenantConfig;
}

/**
 * Simple admin panel to edit tenant configuration.
 * Demonstrates the CMS white-label capability.
 * Changes are saved to localStorage.
 */
export function AdminPanel({ initialConfig }: AdminPanelProps) {
  const [name, setName] = useState(initialConfig.name);
  const [theme, setTheme] = useState<TenantTheme>(initialConfig.theme);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>({
    type: "warning",
    text: "Demo mode: changes are saved to your browser only.",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.theme) setTheme((prev) => ({ ...prev, ...parsed.theme }));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const handleThemeChange = (key: keyof TenantTheme) => (e: ChangeEvent<HTMLInputElement>) => {
    setTheme((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, theme }));
    setMessage({ type: "success", text: "Saved! Reload the page to see changes." });
    setLoading(false);
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
        <Button type="submit" loading={loading}>
          Save Configuration
        </Button>
      </div>
    </form>
  );
}
