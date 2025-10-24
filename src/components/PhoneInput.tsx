// @ts-check
"use client";
import { cn } from "@/src/lib/utils";
import React, { useState } from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
  initialValue?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  className,
  disabled,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
    value || ""
  );

  const handleChange = (value: string | undefined) => {
    setPhoneNumber(value || "");
    onChange(value || "");
  };

  return (
    <PhoneInputWithCountry
      value={phoneNumber}
      onChange={handleChange}
      defaultCountry="PK"
      placeholder="Enter phone number"
      // FIX: Add a custom class for CSS targeting
      className={cn("phone-input-fix", className)}
      international
      limitMaxLength
      disabled={disabled}
    />
  );
};

export default PhoneInput;