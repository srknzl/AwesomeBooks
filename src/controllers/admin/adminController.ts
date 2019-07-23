import { Product } from "../../models/product";
import { RequestHandler } from "express";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll((products: Product[]) => {
    res.render("admin/products", {
      pageTitle: "Products",
      active: "admin-products",
      prods: products
    });
  });
};

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    active: "admin-add-product"
  });
};
export const getWelcome: RequestHandler = (req, res, next) => {
  res.render("admin/welcome", {
    pageTitle: "Admin login successful",
    active: "welcome"
  });
};
export const postAddProduct: RequestHandler = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl);
  product.save();
  res.redirect("/admin/products");
};

export const getEditProduct: RequestHandler = (req, res, next) => {
  const prodId = req.params.id;
  Product.getProductById(prodId, (product: Product) => {
    res.render("admin/edit-product", {
      active: "edit-product",
      product: product
    });
  });
};
export const postEditProduct: RequestHandler = (req, res, next) => {
  const prodId = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.updateProduct(
    prodId,
    {
      description,
      imageUrl,
      price,
      title
    },
    () => {
      res.redirect('/admin/products');
    }
  );
};
export const postDeleteProduct:RequestHandler = (req, res,next)=>{
  const id = req.body.id;
  console.log(id);
  Product.deleteProduct(id);
  res.redirect('/admin/products');
}
export const getNotFound: RequestHandler = (req, res, next) => {
  res.render("errors/admin-not-found", {
    pageTitle: "Not found",
    active: ""
  });
};
