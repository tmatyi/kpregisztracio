"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TextField } from "@/components/atoms/FormField";
import { TicketType } from "@/types";

interface BaseTicketFieldsProps {
  index: number;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function IndividualChildFields({
  index,
  register,
  errors,
}: BaseTicketFieldsProps) {
  const ticketErrors = errors.tickets as any;
  const error = ticketErrors?.[index]?.data;

  return (
    <div className="space-y-4">
      <TextField
        label="Child's Name"
        required
        {...register(`tickets.${index}.data.holder_name`)}
        error={error?.holder_name?.message as string}
      />

      <TextField
        label="Age"
        type="number"
        required
        {...register(`tickets.${index}.data.holder_age`, {
          valueAsNumber: true,
        })}
        error={error?.holder_age?.message as string}
      />

      <TextField
        label="Parent/Guardian Name"
        required
        {...register(`tickets.${index}.data.parent_name`)}
        error={error?.parent_name?.message as string}
      />

      <TextField
        label="Email"
        type="email"
        required
        {...register(`tickets.${index}.data.email`)}
        error={error?.email?.message as string}
      />

      <TextField
        label="Phone Number"
        type="tel"
        required
        {...register(`tickets.${index}.data.holder_phone`)}
        error={error?.holder_phone?.message as string}
      />

      <TextField
        label="Address"
        required
        {...register(`tickets.${index}.data.holder_address`)}
        error={error?.holder_address?.message as string}
      />
    </div>
  );
}

export function IndividualAdultFields({
  index,
  register,
  errors,
}: BaseTicketFieldsProps) {
  const ticketErrors = errors.tickets as any;
  const error = ticketErrors?.[index]?.data;

  return (
    <div className="space-y-4">
      <TextField
        label="Name"
        required
        {...register(`tickets.${index}.data.holder_name`)}
        error={error?.holder_name?.message as string}
      />

      <TextField
        label="Email"
        type="email"
        required
        {...register(`tickets.${index}.data.email`)}
        error={error?.email?.message as string}
      />

      <TextField
        label="Phone Number"
        type="tel"
        required
        {...register(`tickets.${index}.data.holder_phone`)}
        error={error?.holder_phone?.message as string}
      />
    </div>
  );
}

export function GroupChildFields({
  index,
  register,
  errors,
}: BaseTicketFieldsProps) {
  const ticketErrors = errors.tickets as any;
  const error = ticketErrors?.[index]?.data;

  return (
    <div className="space-y-4">
      <TextField
        label="Child's Name"
        required
        {...register(`tickets.${index}.data.holder_name`)}
        error={error?.holder_name?.message as string}
      />

      <TextField
        label="Age"
        type="number"
        required
        {...register(`tickets.${index}.data.holder_age`, {
          valueAsNumber: true,
        })}
        error={error?.holder_age?.message as string}
      />
    </div>
  );
}

export function GroupAdultFields({
  index,
  register,
  errors,
}: BaseTicketFieldsProps) {
  const ticketErrors = errors.tickets as any;
  const error = ticketErrors?.[index]?.data;

  return (
    <div className="space-y-4">
      <TextField
        label="Name"
        required
        {...register(`tickets.${index}.data.holder_name`)}
        error={error?.holder_name?.message as string}
      />
    </div>
  );
}

interface TicketFormFieldsProps extends BaseTicketFieldsProps {
  ticketType: TicketType;
}

export function TicketFormFields({
  ticketType,
  index,
  register,
  errors,
}: TicketFormFieldsProps) {
  switch (ticketType) {
    case "individual_child":
      return (
        <IndividualChildFields
          index={index}
          register={register}
          errors={errors}
        />
      );
    case "individual_adult":
      return (
        <IndividualAdultFields
          index={index}
          register={register}
          errors={errors}
        />
      );
    case "group_child":
      return (
        <GroupChildFields index={index} register={register} errors={errors} />
      );
    case "group_adult":
      return (
        <GroupAdultFields index={index} register={register} errors={errors} />
      );
    default:
      return null;
  }
}
