import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./Instagram.css";

const gallery = [
  {
    image:
      "https://media.admiddleeast.com/photos/651abd627d01c0bd22201f5e/1:1/w_3056,h_3056,c_limit/Suryagarh%20Akshay%20Shoot-7A%20Retouched.jpg",
    title: "Royal Rajasthan",
  },
  {
    image:
      "https://static.wixstatic.com/media/4052b2_44e8635b91d74f339abc99cbd420667f~mv2.jpg/v1/fill/w_980,h_985,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4052b2_44e8635b91d74f339abc99cbd420667f~mv2.jpg",
    title: "The Marwari",
  },
  {
    image:
      "https://photos.tpn.to/ih/fj/eq/hi/653x490.jpg",
    title: "Ride with Heritage",
  },
  {
    image:
      "https://www.ecuestre.es/upload/images/paragrapharticle/148907/paragrapharticle-5951-5b0d708e74f72.jpg",
    title: "Tradition in Motion",
  },
  {
    image:
      "https://static.wixstatic.com/media/6ec7af_351acb64082f415daa9733c18924c3d9~mv2.jpg/v1/fill/w_960,h_1152,al_c,q_85,enc_avif,quality_auto/6ec7af_351acb64082f415daa9733c18924c3d9~mv2.jpg",
    title: "Royal Equestrian",
  },
];

const Instagram = () => {
  return (
    <section className="instagram-section">

      {/* Header */}
      <div className="instagram-header">

        <div className="instagram-title">
          <span className="instagram-symbol">◎</span>
          <span>@SADDLEANDCREST</span>
        </div>

        <div className="instagram-heading">
          <span>From India,</span>
          <h2>
            with <em>heritage.</em>
          </h2>
        </div>

        <p className="instagram-description">
          A visual journal of horses, craftsmanship,
          royal traditions and the timeless Indian
          equestrian spirit.
        </p>

      </div>

      {/* Gallery */}
      <div className="instagram-grid">

        {gallery.map((item, index) => (
          <a
            href="#instagram"
            className="instagram-card"
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
            />

            <div className="instagram-overlay">

              <div className="instagram-overlay-content">
                <span>{item.title}</span>

                <div className="instagram-arrow">
                  <ArrowUpRight size={18} />
                </div>
              </div>

            </div>
          </a>
        ))}

      </div>

      {/* Bottom */}
      <div className="instagram-bottom">

        <span>
          FOLLOW OUR JOURNEY
        </span>

        <a href="#instagram">
          @SADDLEANDCREST
          <ArrowUpRight size={15} />
        </a>

      </div>

    </section>
  );
};

export default Instagram;