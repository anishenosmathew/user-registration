import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'registration';
  registrationForm: FormGroup;
  isEdit = false;
  showAddBtn= true;
  addressesdata = {
    city: "Bangalore",
    state: "Karnataka",
    pinCode: "123456"
  }
  users = [];
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}
 
  ngOnInit() {
      this.registrationForm = this.fb.group({
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: this.fb.array([this.newAddressFormGroup(this.addressesdata,false)])
      });
      if(sessionStorage.getItem("users") != null) {
        this.users = JSON.parse(sessionStorage.getItem("users"));
      }
  }
 
  get f(){
    return this.registrationForm.controls;
  }
 
  get addresses(): FormArray {
    return this.registrationForm.get('address') as FormArray;
  }
 
  addAddress() {
    this.addresses.push(this.newAddressFormGroup(null,true));
    console.log(this.registrationForm.value)
     this.showAddBtn = false;
  }
 
  newAddressFormGroup(item:any, isEdit): FormGroup {
    if(item) {
      return this.fb.group({
        city: [item.city|| '', Validators.required],
        state:  [item.state||'', Validators.required],
        pinCode: [item.pinCode||'', Validators.required], 
        isEdit: [isEdit]
      });
    } else {
      return this.fb.group({
        city: ['', Validators.required],
        state:  ['', Validators.required],
        pinCode: ['', Validators.required], 
        isEdit: [isEdit]
      });
    }  
  }
 
  saveAddress(index) {
    if(!this.addresses.controls[index].invalid) {
      this.addresses.controls[index].value.isEdit = false;
      this.showAddBtn = true;
    } else {
      this.addresses.controls[index].markAllAsTouched();
    }
  }
 
  register() {
    if(!this.registrationForm.invalid) {
      console.log(this.registrationForm.value);
      this.users.push(this.registrationForm.value);
      sessionStorage.setItem("users", JSON.stringify(this.users));
      this.snackBar.open("User registered successfully !", "Close");
    }
  }
 
  cancel(index) {
    this.addresses.removeAt(index);
    this.showAddBtn = true;
  }
  
  removeUser(index) {
    this.users.splice(index, 1);
    sessionStorage.setItem("users", JSON.stringify(this.users));    
  }
 
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }
}
 
 
