"use client";

/**
 * Drawer UI primitives – thin wrappers around @base-ui/react's Drawer.
 *
 * Named exports match the shadcn-style API used across this codebase:
 *   Drawer         – root (open / onOpenChange / swipeDirection)
 *   DrawerTrigger  – button that opens the drawer
 *   DrawerContent  – portal + backdrop + popup bundled together
 *   DrawerHeader / DrawerFooter – layout helpers
 *   DrawerTitle / DrawerDescription – accessible labelling
 *   DrawerClose    – button that closes the drawer
 */

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";

// ─── Root ────────────────────────────────────────────────────────────────────

const Drawer = DrawerPrimitive.Root;

// ─── Trigger ─────────────────────────────────────────────────────────────────

const DrawerTrigger = DrawerPrimitive.Trigger;

// ─── Close ───────────────────────────────────────────────────────────────────

const DrawerClose = DrawerPrimitive.Close;

// ─── Content ─────────────────────────────────────────────────────────────────
// Bundles Portal + Backdrop + Viewport + Popup so callers can write:
//   <DrawerContent className="...">…</DrawerContent>

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-300" />
    <DrawerPrimitive.Viewport className="fixed inset-0 z-40 flex overflow-hidden">
      <DrawerPrimitive.Popup
        ref={ref}
        className={cn(
          "flex flex-col overflow-y-auto outline-none",
          "data-[ending-style]:opacity-0 data-[ending-style]:translate-x-full",
          "data-[starting-style]:opacity-0 data-[starting-style]:translate-x-full",
          "transition-[opacity,transform] duration-300 ease-out",
          className
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

// ─── Header ──────────────────────────────────────────────────────────────────

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}

// ─── Title ───────────────────────────────────────────────────────────────────

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

// ─── Description ─────────────────────────────────────────────────────────────

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
