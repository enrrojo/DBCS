package com.uva.REST.Model;

import java.sql.Date;

import javax.persistence.*;
import javax.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue
    @Column(unique=true)
    private Integer Id;
    @Column(unique=true)
    private String name;
    private String firstName;
    private String lastName;
    @Size(max = 50)
    @Column(unique=true)
    private String email;
    private String password;
    private boolean enabled=true; //El valor por defecto al crear un usuario nuevo es true
    private Role role;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date createdAt;
    @UpdateTimestamp
    private Date updatedAt;
    
    User() { }
    
    User(Integer id, String name, String firstName, String lastName, @Size(max = 50) String email,
            String password, boolean enabled, Role role, Date createdAt, Date updatedAt) {
        Id = id;
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}

