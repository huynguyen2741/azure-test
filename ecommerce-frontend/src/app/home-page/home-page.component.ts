import { Component, OnInit } from '@angular/core';
import { Product } from '../Models/product';
import { ProductService } from '../services/product-service/product.service';
import { CartService } from '../services/cart-service/cart.service';
import { CartItem } from '../Models/cart-item';
import { OktaAuthService } from '@okta/okta-angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';
import { User } from '../Models/user';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];
  users: any = {};
  imageUrl: string = "https://res.cloudinary.com/drukcz14j/image/upload/v1661201584/ecommerce/iPhone-13-PNG-Cutout_wydwdd.png";
  constructor(private cartService: CartService, private productService: ProductService, private oktaAuthService: OktaAuthService,
    private router: Router, private userService: UserService) {
     if(this.oktaAuthService.isLoginRedirect()) {
      this.oktaAuthService.handleLoginRedirect().then(() => {
        this.router.navigate(['home']);
      })
    }
  }
      

  ngOnInit(): void {
    this.getProducts();
    this.oktaAuthService.getUser().then((u) => {
      if(!this.userExists(u.sub)) {
        let user: any = {
          oktaId: u.sub,
          userId: 0,
          firstName: "test",
          lastName: "test",
          email: u.email,
          userName: "test",
          password: "password",
          contact: "contact",
          ssn: "ssn",
          roles: []
        }
        this.addUser(user);
        this.getUsers();
      }
    })
    
  }
  getUsers() {
    this.userService.getAllUsers().subscribe();
  }
  addUser(user: User) {
    console.log("adding user");
    this.userService.createUser(user).subscribe();
  }
  userExists(sub: string) {
   this.userService.getUserByOktaId(sub).subscribe((data: any) => {
    this.users = data;
    if(Object.keys(data).length > 0) {
      return true;
    }
    return false;
   })
   console.log
  
   return false;

  }

  getProducts() {
    this.productService.getAllProducts()
      .subscribe({ next: (data: Product[]) => {
        this.products = data;
      },
      error: (e) => console.error(e)});
    }
  
	addToCart(theProduct: Product) {
	const theCartItem = new CartItem(theProduct);
	
	this.cartService.addToCart(theCartItem);
	}

}