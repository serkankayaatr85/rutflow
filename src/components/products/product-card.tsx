import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RequestSampleButton } from "@/components/products/request-sample-button";
import type { ProductWithRepresentative, ProductWithSample } from "@/lib/supabase/queries";

interface OwnerProductCardProps {
  variant: "owner";
  product: ProductWithSample;
}

interface BrowseProductCardProps {
  variant: "browse";
  product: ProductWithRepresentative;
  alreadyRequested: boolean;
}

type ProductCardProps = OwnerProductCardProps | BrowseProductCardProps;

export function ProductCard(props: ProductCardProps) {
  const { product } = props;
  const sample = product.product_samples?.[0];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-14 w-14 shrink-0 rounded-md border object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Package className="h-6 w-6" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.product_categories?.category_name ?? "—"}</p>
            {props.variant === "browse" && props.product.representatives && (
              <p className="mt-1 text-xs text-muted-foreground">
                {props.product.representatives.company_name} · {props.product.representatives.region}
              </p>
            )}
          </div>

          {sample?.sample_available && (
            <Badge variant="success" className="shrink-0">
              Numune Var
            </Badge>
          )}
        </div>

        {product.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        )}

        {props.variant === "browse" && sample?.sample_available && props.product.representatives && (
          <RequestSampleButton
            productId={product.id}
            representativeId={props.product.representatives.id}
            alreadyRequested={props.alreadyRequested}
          />
        )}
      </CardContent>
    </Card>
  );
}
