"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LocateFixed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import StepperHeader from "./stepper-header";
import SubmitFooter from "./submit-footer";

import { registerRestaurant } from "@/actions/restaurant-actions";
import dynamic from "next/dynamic";
import { set, z } from "zod";
const MapPicker = dynamic(() => import("@/components/common/map-picker"), { ssr: false });

const registerRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  area: z.string().min(2, "Area is required"),

  deliveryTime: z
    .number()
    .min(0, "Delivery time must be positive"),

  latitude: z
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),

  longitude: z
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),

  image: z.instanceof(File).optional(),
});

type RegisterRestaurantInput = z.infer<
  typeof registerRestaurantSchema
>;


export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [geoLoading, setGeoLoading] = useState(false);

  const form = useForm<RegisterRestaurantInput>({
    resolver: zodResolver(registerRestaurantSchema),
    defaultValues: {
      deliveryTime: 30,
      latitude: 9.02497,
      longitude: 38.7469,
    },
  });

  const watchedLat = form.watch("latitude");
  const watchedLng = form.watch("longitude");

    const onLocationChange = (lat: number, lng: number) => {
    form.setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
    form.setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
    trigger,
    setValue,
  } = form;

  /* ---------------- GEO LOCATION ---------------- */
  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude);
        setValue("longitude", pos.coords.longitude);
        toast.success("Location captured");
        setGeoLoading(false);
      },
      () => {
        toast.error("Failed to get location");
        setGeoLoading(false);
      }
    );
  };

  /* ---------------- STEP NAV ---------------- */
  const nextStep = async () => {
    const valid = await trigger(
      step === 1
        ? ["name", "area", "deliveryTime"]
        : step === 2
        ? ["latitude", "longitude"]
        : undefined
    );

    if (!valid) return;
    setStep((s) => s + 1);
    if(step===2){
      setStep(1)
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data: RegisterRestaurantInput) => {
    const payload = {
      name: data.name,
      area: data.area,
      deliveryTime: data.deliveryTime,
      image: data.image,
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
    };

    console.log("SUBMIT PAYLOAD", payload);
     const res = await registerRestaurant(data)
          console.log(res)
          if (!res.success) {
            toast.error(res.message)
            return
          }
    setStep(1)
          toast.success(res.message)
          form.reset()
    // await new Promise((r) => setTimeout(r, 1500));
    // toast.success("Restaurant registered 🎉");
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow dark:bg-[#2d1e18]">
      <StepperHeader step={step} />

      <Form {...form}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("step", step);
            if (step < 2) {
              await nextStep();
              return;
            }

            await handleSubmit(onSubmit)(e as any);
          }}
          className="space-y-8 p-8"
        >
          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <>
              <h2 className="mb-6 text-xl font-bold">Restaurant Identity</h2>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="The Tasty Bistro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Account */}
              <section>
                <h2 className="mb-6 text-xl font-bold">Account Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="owner@restaurant.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555 000 0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter a secure password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
              </section>
              <div className="grid gap-4 md:grid-cols-2"> 

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Bole, Kazanchis…" {...field} /> */}
                      <Select
                      onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Select Area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {["Bole", "Geda","Kereyu","Fresh","04","Posta","Mebrat","Other"].map((area,k)=>(

                            <SelectItem key={k} value={area}>{area}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Delivery Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            </>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end justify-center gap-4">
                  <FormField
                    control={form.control}
                    name="longitude"  
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={captureLocation}
                    disabled={geoLoading}
                  >
                    {geoLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="mr-2 h-4 w-4 text-primary" />
                    )}
                    {/* Use my current location */}
                  </Button>
                </div>

              </div>
                <MapPicker lat={Number(watchedLat) ?? -1.2921} lng={Number(watchedLng) ?? 36.8219} onChange={onLocationChange} />

            </>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {/* {step === 3 && (
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

{/* 

            const nextStep = async () => {
    const valid = await trigger(
      step === 1
        ? ["name", "area", "deliveryTime"]
        : step === 2
        ? ["latitude", "longitude"]
        : undefined
    );

    if (!valid) return;
    setStep((s) => s + 1);
    if(step===2){
      setStep(1)
    }
  };

  const prevStep = () => setStep((s) => s - 1); */}

          <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
      <p className="text-sm text-muted-foreground">
        By continuing, you agree to our Terms of Service.
      </p>

      <div className="flex w-full gap-4 md:w-auto">
        {step === 2 && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Restaurant
            </Button>
          </>
        )}

        {step==1 && (
          <Button
            type="button"
            onClick={ async () => {
              const values = form.getValues(["name", "area", "deliveryTime"]);
              const result = registerRestaurantSchema.safeParse({
                name: values[0],
                area: values[1],
                deliveryTime: values[2],
              });

                // const valid = await trigger(["name", "area", "deliveryTime"]);
                    // if (!result.success) {
                    //   await trigger(["name", "area", "deliveryTime"]);
                    //   return};
                    setStep((s) => s + 1);
                  }
                }
          >
           Next
          </Button>
        )}
      </div>
    </div>
        {/* {step==1 ? (

            <SubmitFooter
              isSubmitting={false}
              onBack={step > 1 ? prevStep : undefined}
              onNext={step < 2 ? nextStep : undefined}
              isLastStep={false}
              submitLabel={
                
                  "Next"
               
              }
            />
        ):(

          <SubmitFooter
            isSubmitting={isSubmitting}
            onBack={step > 1 ? prevStep : undefined}
            onNext={step < 3 ? nextStep : undefined}
            isLastStep={false}
            submitLabel={
               isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register Restaurant"
              )
            }
          />
        )} */}

        </form>
      </Form>
    </div>
  );
}
